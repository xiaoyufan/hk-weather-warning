var Topic = module.exports = function(client) {
  this.client = client;
};

Topic.prototype.checkUpdate = function(topic, language, pubdate, callback) {
  this.client.hget(topic, language + '_pubdate', function(err, obj) {
    if (err) {
      return callback(err);
    }
    if (obj) {
      if (obj == pubdate) {
        return callback(null, false);
      } else {
        return callback(null, true);
      }
    }
    return callback(null, true);
  });
};

Topic.prototype.updateContent = function(topic, language, pubdate, content, callback) {
  this.client.hmset(topic, language + '_pubdate', pubdate, language + '_content', content, function(err) {
    if (err) {
      return callback(err);
    }
    return callback(null);
  });
};

Topic.prototype.getContent = function(topic, language, callback) {
  this.client.hget(topic, language + '_content', function(err, obj) {
    if (err) {
      return callback(err);
    }
    return callback(null, obj);
  });
};

Topic.prototype.subscribe = function(topic, id, callback) {
  this.client.sadd(topic + '_subscriber', id, function(err) {
    if (err) {
      return callback(err);
    }
    return callback(null);
  });
};

Topic.prototype.unsubscribe = function(topic, id, callback) {
  this.client.srem(topic + '_subscriber', id, function(err) {
    if (err) {
      return callback(err);
    }
    return callback(null);
  });
};

Topic.prototype.getSubscriber = function(topic, callback) {
  this.client.smembers(topic + '_subscriber', function(err, obj) {
    if (err) {
      return callback(err);
    }
    return callback(null, obj);
  });
};
