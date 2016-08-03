var FeedHandler = require('./FeedHandler.js');
var rssSettings = require('./../settings.js').rssSettings;

/**
 * @param {!number} interval in minutes
 * @param {!Object} client redis client
 */
module.exports = function(interval, client) {
  var fh = new FeedHandler(rssSettings.current.url_en);

  setInterval(function() {
    fh.read(function(err, item) {
      if (err) {
        return console.error(err);
      }

      if (item) {
        var pubdate = item.pubdate;
      }
    });
  }, interval * 60000);
};
