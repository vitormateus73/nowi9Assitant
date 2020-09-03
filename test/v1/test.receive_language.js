const Botkit = require('botkit');
const nock = require('nock');
const expect = require('chai').expect;
const _ = require('lodash');
const clone = require('clone');

describe('v1/ receive() text language support', function() {
  // Botkit params
  const controller = Botkit.slackbot();
  const bot = controller.spawn({
    token: 'abc123',
  });

  // Dialogflow middleware
  const middleware = require('../../src/botkit-middleware-dialogflow')({
    version: 'v1',
    token: 'abc',
  });

  // Setup message objects
  const defaultMessage = {
    type: 'direct_message',
    text: 'hi',
    user: 'test_user',
    channel: 'test_channel',
  };

  const englishMessage = {
    type: 'direct_message',
    text: 'hi',
    lang: 'en',
    user: 'test_user',
    channel: 'test_channel',
  };

  const frenchMessage = {
    type: 'direct_message',
    text: 'bonjour',
    lang: 'fr',
    user: 'test_user',
    channel: 'test_channel',
  };

  // tests
  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.cleanAll();
  });

  it('should call the Dialogflow API with en if no language is specified on message object', function(done) {
    nock('https://api.api.ai:443', { encodedQueryParams: true })
      .post('/v1/query', _.matches({ lang: 'en', query: 'hi' }))
      .query({ v: '20150910' })
      .reply(200);
    // .log(console.log);

    middleware.receive(bot, clone(defaultMessage), function(err, response) {
      expect(nock.isDone()).is.true;
      done();
    });
  });

  // the language used by the nodejs client for Dialogflow is sticky over subsequent calls
  // Need to confirm we're resetting it.
  it('should call the API with correct language over subsequent calls in different languages', function(done) {
    nock('https://api.api.ai:443', { encodedQueryParams: true })
      .post('/v1/query', _.matches({ lang: 'en', query: 'hi' }))
      .query({ v: '20150910' })
      .reply(200);
    // .log(console.log);

    middleware.receive(bot, clone(englishMessage), function(err, response) {
      expect(nock.isDone()).is.true;
    });

    nock('https://api.api.ai:443', { encodedQueryParams: true })
      .post('/v1/query', _.matches({ lang: 'fr', query: 'bonjour' }))
      .query({ v: '20150910' })
      .reply(200);
    // .log(console.log);

    middleware.receive(bot, clone(frenchMessage), function(err, response) {
      expect(nock.isDone()).is.true;
    });

    nock('https://api.api.ai:443', { encodedQueryParams: true })
      .post('/v1/query', _.matches({ lang: 'en', query: 'hi' }))
      .query({ v: '20150910' })
      .reply(200);
    // .log(console.log);

    middleware.receive(bot, clone(defaultMessage), function(err, response) {
      expect(nock.isDone()).is.true;
    });

    done();
  });

  it('should flow the language set on the message object through to the response', function(done) {
    nock('https://api.api.ai:443', { encodedQueryParams: true })
      .post('/v1/query', _.matches({ lang: 'fr', query: 'bonjour' }))
      .query({ v: '20150910' })
      .reply(200, {
        id: '7cfc3ba7-cf87-4319-8c7a-0ba2f598e813',
        timestamp: '2018-05-21T17:35:29.91Z',
        lang: 'fr',
        result: {
          source: 'agent',
          resolvedQuery: 'bonjour',
          action: '',
          actionIncomplete: false,
          parameters: {},
          contexts: [],
          metadata: {
            intentId: 'bd8fdabb-2fd6-4018-a3a5-0c57c41f65c1',
            webhookUsed: 'false',
            webhookForSlotFillingUsed: 'false',
            intentName: 'hello-intent',
          },
          fulfillment: {
            speech: 'comment vas-tu aujourd\'hui',
            messages: [{ type: 0, speech: 'comment vas-tu aujourd\'hui' }],
          },
          score: 1,
        },
        status: { code: 200, errorType: 'success' },
        sessionId: '563be240-5d1d-11e8-9139-bfbb9dca30b5',
      });
    // .log(console.log);

    const msg = clone(frenchMessage);
    middleware.receive(bot, msg, function(err, response) {
      expect(nock.isDone()).is.true;
      expect(msg.lang).is.equal('fr');
      done();
    });
  });
});
