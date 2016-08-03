'use strict'

var botSettings = require('./settings.js').botSettings;
var BotHandler = require('./handlers/BotHandler');
var WeatherHandler = require('./handlers/WeatherHandler');

var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(botSettings.token, {polling: true});

var redis = require('redis');
var client = redis.createClient();

BotHandler(bot, client);
WeatherHandler(0.01, client);
