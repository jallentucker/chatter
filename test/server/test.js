'use strict';

var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);

var app = require('../../server/application');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

var expect = require('chai').expect;


describe('server', function() {
  before(function(done) { this.server = app.listen(port, function() { done(); }); });
  after(function(done) { this.server.close(done); });

  it('gets no chirps when database is empty', function(done) {
    requestAsync(baseURL + '/api/chirps').spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql({'chirps':[]});
    })
    .done(function() { done(); }, done);
  });
});
