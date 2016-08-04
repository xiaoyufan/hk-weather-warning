var rssLanguages = require('./../constants').rssLanguages;

var User = module.exports = function(client) {
  this.client = client;
};

User.prototype.getLanguage = function(userid, callback) {
  this.client.hget('language', userid, function(err, language) {
    if (err) {
      return callback(err, rssLanguages.default);
    }
    if (language) {
      return callback(null, language);
    }
    return callback(null, rssLanguages.default);
  });
};

User.prototype.setLanguage = function(userid, language, callback) {
  this.client.hmset('language', userid, language, function(err) {
    if (err) {
      return callback(err);
    }
    return callback(null);
  });
};
