'use strict';

describe('app', function() {
  beforeEach(function() {
    var container = applicationContainer();
    var session = container.lookup('auth-session:main');
    session.set('content', {
      username: 'fake-username',
      token: 'fake-token'
    });
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;
  });
  afterEach(function() {
    this.server.restore();
    Chatter.reset();
  });

  it('will allow user to create a post', function() {
    this.server.respondWith("POST", "/api/chirps",
      [200, { "Content-Type": "application/json" },
        JSON.stringify(__fixture('chirp-create'))]);
    this.server.respondWith("GET", "/api/chirps",
      [200, { "Content-Type": "application/json" },
        JSON.stringify(__fixture('chirps'))]);
    visit('/');
    // TODO: test to make sure we sent a good request to the server
    fillIn('input.postBox', 'LOOK AT ME!!!!!');
    click('button[name="submit"]');
    andThen(function() {
      expect(find('ul.chirps li:last').text()).to.eql('hi');
    });
  });

  it('will allow user to create a post', function() {
    this.server.respondWith("GET", "/api/chirps",
      [200, { "Content-Type": "application/json" },
        JSON.stringify(__fixture('chirps'))]);
    visit('/chirps');
    andThen(function() {
      expect(find('ul.chirps li:last').text()).to.eql('hi');
    });
  });
});
