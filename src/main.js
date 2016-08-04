'use strict';

var botSettings = require('./constants.js').botSettings;
var rssSettings = require('./constants.js').rssSettings;
var BotHandler = require('./handlers/BotHandler');
var WeatherHandler = require('./handlers/WeatherHandler');

var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(botSettings.token, {polling: true});

var client = require('./models/client.js');
var User = require('./models/user.js');
var Topic = require('./models/Topic.js');

var models = {
  user: new User(client),
  topic: new Topic(client)
};

var bothandler = new BotHandler(bot, models);
new WeatherHandler(rssSettings.poll_interval, models, bothandler);
