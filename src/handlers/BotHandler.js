var rssTopics = require('./../constants.js').rssTopics;

var errmsg = 'An error occurred. Please try again.';

var setLanguage = function(model_user, id, language, callback) {
  model_user.setLanguage(id, language, function(err) {
    if (err) {
      console.error(err);
      return callback(errmsg);
    }
    if (language === '繁體中文' || language === '简体中文') {
      return callback('知道了');
    }
    return callback('OK');
  });
};

var getLanguage = function(model_user, id, callback) {
  model_user.getLanguage(id, function(err, language) {
    if (err) {
      console.error(err);
    }
    return callback(language);
  });
};

var getContent = function(model_topic, topic, language, callback) {
  model_topic.getContent(topic, language, function(err, content) {
    if (err) {
      return callback(err);
    }
    return callback(null, content);
  });
};
  
var BotHandler = module.exports = function(bot, models) {
  var model_user = models.user;
  var model_topic = models.topic;
  this.bot = bot;
  this.model_topic = model_topic;
  this.model_user = model_user;

  var topics = [];
  for (var key_topic in rssTopics) {
    topics.push(key_topic);
  }
  topics = topics.join(', ');

  bot.onText(/\/start/, function(msg) {
    var chat = msg.chat;
    if (chat.type == 'private') {
      bot.sendMessage(chat.id, 'Hi ' + chat.first_name);
    } else {
      bot.sendMessage(chat.id, 'Hi ' + chat.title);
    }
  });

  bot.onText(/\/help/, function(msg){
    var content = 'You can send me these commands:\r\n\r\n/topics - list out topics that our bot support\r\n/tellme [topic] - receive latest info about the topic\r\n/subscribe [topic] - automatically receive updated info about the topic\r\n/unsubscribe [topic] - stop receiving updated info about the topic\r\n/English - set language of info to English\r\n/繁體中文 - 設定接收的資訊為繁體中文\r\n/简体中文 - 设定接收的资讯为简体中文';
    bot.sendMessage(msg.chat.id, content);
  });

  bot.onText(/\/topics/, function(msg) {
    bot.sendMessage(msg.chat.id, topics);
  });

  bot.onText(/\/tellme (.+)/, function(msg, match) {
    var topic = match[1];

    getLanguage(model_user, msg.chat.id, function(language) {
      getContent(model_topic, topic, language, function(err, content) {
        if (err) {
          return console.error(err);
        }
        if (content) {
          return bot.sendMessage(msg.chat.id, content);
        }
        bot.sendMessage(msg.chat.id, 'I can tell you info about:\r\n' + topics);
      });
    });
  });

  bot.onText(/\/subscribe (.+)/, function(msg, match) {
    var chatId = msg.chat.id;
    var topic = match[1];

    model_topic.subscribe(topic, chatId, function(err) {
      if (err) {
        console.error(err);
        return bot.sendMessage(chatId, errmsg);
      }
      bot.sendMessage(chatId, 'OK');
    });
  });

  bot.onText(/\/unsubscribe (.+)/, function(msg, match) {
    var chatId = msg.chat.id;
    var topic = match[1];

    model_topic.unsubscribe(topic, chatId, function(err) {
      if (err) {
        console.error(err);
        return bot.sendMessage(chatId, errmsg);
      }
      bot.sendMessage(chatId, 'OK');
    });
  });

  bot.onText(/\/English/, function(msg) {
    var chatId = msg.chat.id;
    setLanguage(model_user, chatId, 'en', function(content) {
      bot.sendMessage(chatId, content);
    });
  });

  bot.onText(/\/繁體中文/, function(msg) {
    var chatId = msg.chat.id;
    setLanguage(model_user, chatId, 'tc', function(content) {
      bot.sendMessage(chatId, content);
    });
  });

  bot.onText(/\/简体中文/, function(msg) {
    var chatId = msg.chat.id;
    setLanguage(model_user, chatId, 'sc', function(content) {
      bot.sendMessage(chatId, content);
    });
  });

  bot.getMe().then(function(me) {
    console.info(me.username + ' is listening!');
  });
};

BotHandler.prototype.sendToSubscriber = function(topic, language) {
  var bot = this.bot;
  var model_user = this.model_user;
  var model_topic = this.model_topic;
  
  this.model_topic.getSubscriber(topic, function(err, subscribers) {
    if (err) {
      return console.error(err);
    }
    if (subscribers) {
      var length = subscribers.length;
      for (var i = 0; i < length; i++) {
        var subscriber = subscribers[i];
        getLanguage(model_user, subscriber, function(lan) {
          if (lan === language) {
            getContent(model_topic, topic, language, function(err, content) {
              if (err) {
                return console.error(err);
              }
              if (content) {
                return bot.sendMessage(subscriber, content);
              }
            });
          }
        });
      }
    }
  });
};
