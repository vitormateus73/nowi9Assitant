const Botkit = require('botkit');

const middleware = require('../app/botkit-middleware-dialogflow')({
  keyFilename: '/Users/vitormateus/Documents/BotKitDialogFlowExemple/botkit-middleware-dialogflow/src/chatbotbrq-9245e14889ef.json',
});

const controller = Botkit.facebookbot({
  debug: true,
  log: true,
  access_token: 'EAAfhcJUkmeQBANZB34yMHSqBLu5bIy1sHXfTn18ZAH0qhE13dlF8Fu6SPZBe5R5cMOAuoOKHd9TLRxjdFJBL8lQnUBmdZBId3fBCSLXfORlpWsKSix1SJXfCH4i7Bk7BZAusxgznUlkhEyM63fdiZBJPXNKmjMebfkRfgyBRVrCkk0zBgcvU2q',
  verify_token: 'equipeBRQ',
  app_secret: 'b424e04d4e47adcc4ed71c3c798b8504',
  validate_requests: true, // Refuse any requests that don't provide the app_secret specified
});

const bot = controller.spawn({});

/* note this uses example middleware defined above */
controller.hears(['.*'], 'message_received,facebook_postback', middleware.hears, function(bot,message) {
  console.log(message);
  bot.reply(message, message.fulfillment.text);
});

module.exports.controller = controller;
module.exports.bot = bot;
module.exports.middleware = middleware;
