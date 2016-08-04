var request = require('request');
var FeedMe = require('feedme');

/**
 * @constructor
 * @param {!string} feed rss feed url
 */
var FeedHandler = module.exports = function(feed) {
  this.feed = feed;
};

/**
 * @param {function(Object, Obejct)} callback return error and item
 */
FeedHandler.prototype.read = function(callback) {
  var parser = new FeedMe();

  parser.once('item', function(item) {
    return callback(null, item);
  });

  parser.once('end', function() {
    if (parser.close) {
      parser.close();
    }
  });

  var req = request(this.feed);

  req.on('error', function(err) {
    return callback(err);
  });

  req.on('response', function(res) {
    var stream = this;

    if (res.statusCode == 304) {
      return callback(null, null);
    }

    if (res.statusCode != 200) {
      return this.emit('error', new Error('Bad status code'));
    }
    
    stream.pipe(parser);
  });
};

FeedHandler.prototype.extractContent = function(topic, laguage, item) {
  var content;

  if (topic === 'current') {
    content = item.description.split('<p>')[1];
    if (content.includes('img')) {
      content = content.split('<br/><br/>')[1];
    }
    content = content.replace(/<br\/>/g, '');

    var contents = content.split('\r\n');
    content = contents[1].trim().concat(' ').concat(contents[2].trim());
    contents = contents.slice(3);
    contents.unshift(content);
    content = contents.join('\r\n');
  } else if (topic === 'warning') {
    content = item.title;
  }

  return content;
};
