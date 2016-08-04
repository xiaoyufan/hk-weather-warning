var FeedHandler = require('./FeedHandler.js');
var rssTopics = require('./../constants.js').rssTopics;

var startRead = function(feedhandler, topic, language, interval, model_topic, bothandler) {
  var fhread = function() {
    feedhandler.read(function(err, item) {
      if (err) {
        return console.error(err);
      }
      if (item) {
        var pubdate = item.pubdate;
        model_topic.checkUpdate(topic, language, pubdate, function(err, shouldUpdate) {
          if (err) {
            console.error(err);
          } 
          if (shouldUpdate) {
            var content = feedhandler.extractContent(topic, item);
            model_topic.updateContent(topic, language, pubdate, content, function(err) {
              if (err) {
                console.error(err);
              }
              bothandler.sendToSubscriber(topic, language);
            });
          }
        });
      }
    });
  };
  fhread();
  setInterval(fhread, interval * 60000);
};

/**
 * @param {!number} interval in minutes
 * @param {!Object} client redis client
 */
module.exports = function(interval, models, bothandler) {
  var model_topic = models.topic;

  for (var key_topic in rssTopics) {
    var topic = rssTopics[key_topic];
    for (var key_language in topic) {
      var url = topic[key_language];
      var fh = new FeedHandler(url);

      startRead(fh, key_topic, key_language, interval, model_topic, bothandler);
    }
  }
};

