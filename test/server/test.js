'use strict';

var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);

var app = require('../../server/application');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

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

  afterEach(function() {
    // TODO: clear all chirps from the databse
  });

  it('gets no chirps when database is empty', function(done) {
    var fixture = __fixture('chirps-none');
    requestFixture(fixture).spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);
  });

  it.skip('gets a list of chirps when database has stuff', function(done) {
    var fixture = __fixture('chirps-three');

    // TODO: add three chirps to the database

    requestFixture(fixture).spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);

  });
});
