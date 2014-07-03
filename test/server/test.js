'use strict';

var _ = require('lodash');
var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);
var config = require('../../server/config');
var knexConfig = require('../../knexfile')[config.env];
var knex = require('knex')(knexConfig);

var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

var Chirp = models.Chirp;

var expect = require('chai').expect;

var requestFixture = function(fixture) {
  var requestOptions = {
    url: baseURL + fixture.request.url,
    method: fixture.request.method,
    headers: fixture.request.headers,
    body: JSON.stringify(fixture.request.json)
  };

  return requestAsync(requestOptions);
};



describe('server', function() {
  before(function(done) { this.server = app.listen(port, function() { done(); }); });
  after(function(done) { this.server.close(done); });

  afterEach(function(done) {
    knex('chirps').del().then(function() { done(); }, done);
  });

  it('gets no chirps when database is empty', function(done) {
    var fixture = __fixture('chirps-none');
    requestFixture(fixture).spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);
  });

  it('gets a list of chirps when database has stuff', function(done) {
    var fixture = __fixture('chirps-three');

    // TODO: add three chirps to the database
    var savePromises = fixture.response.json.chirps.map(function(chirp) {
      chirp = _.omit(chirp, 'id');
      return Chirp.forge(chirp).save();
    });

    Promise.all(savePromises).then(function() {
      return requestFixture(fixture);
    })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      var jsonOmit = {
        chirps: json.chirps.map(function(chirp) {
          return _.omit(chirp, 'id');
        })
      };
      var jsonFixtureOmit = {
        chirps: fixture.response.json.chirps.map(function(chirp) {
          return _.omit(chirp, 'id');
        })
      };
      expect(jsonOmit).to.eql(jsonFixtureOmit);
    })
    .done(function() { done(); }, done);
  });
});
