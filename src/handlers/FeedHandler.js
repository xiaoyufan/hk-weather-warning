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
  })

  var req = request(this.feed);

  req.on('error', function(err) {
    return callback(err)
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
}
