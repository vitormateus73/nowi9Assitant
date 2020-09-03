require('dotenv').config();

// var middleware = require('botkit-middleware-watson')({
//   iam_apikey: process.env.ASSISTANT_IAM_APIKEY,
//   workspace_id: process.env.WORKSPACE_ID,
//   url: process.env.ASSISTANT_URL || 'https://gateway.watsonplatform.net/assistant/api',
//   version: '2018-07-10'
// });

module.exports = function(app) {

    var Facebook = require('../Boots/facebook_bot');
    Facebook.controller.middleware.receive.use(Facebook.middleware.receive);
    Facebook.controller.createWebhookEndpoints(app, Facebook.bot);
    console.log('Facebook bot is live');


  //Implementação futura
  // if (process.env.USE_SLACK) {
  //   var Slack = require('./bot-slack');
  //   Slack.controller.middleware.receive.use(middleware.receive);
  //   Slack.bot.startRTM();
  //   console.log('Slack bot is live');
  // }
  // if (process.env.USE_FACEBOOK) {
  //   var Facebook = require('./bot-facebook')
  //   Facebook.controller.middleware.receive.use(middleware.receive);
  //   Facebook.controller.createWebhookEndpoints(app, Facebook.bot);
  //   console.log('Facebook bot is live');
  // }
  // if (process.env.USE_TWILIO) {
  //   var Twilio = require('./bot-twilio');
  //   Twilio.controller.middleware.receive.use(middleware.receive);
  //   Twilio.controller.createWebhookEndpoints(app, Twilio.bot);
  //   console.log('Twilio bot is live');
  // }
  // Customize your Watson Middleware object's before and after callbacks.
  // middleware.before = function(message, assistantPayload, callback) {

  //     callback(null, assistantPayload);

  // };
  // middleware.after = function(message, assistantResponse, callback) {

  //   callback(null, assistantResponse);
  
  // };
};
