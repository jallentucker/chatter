'use strict';

describe('app', function() {
  beforeEach(function() {
    var container = applicationContainer();
    var session = container.lookup('auth-session:main');
    session.set('content', {
      username: 'fake-username',
      token: 'fake-token'
    });
  });
  it('will allow user to create a post', function() {
    visit('/');
    fillIn('input.postBox', 'LOOK AT ME!!!!!');
    click('button[name="submit"]');
    andThen(function() {
      expect(find('ul.posts li:last').text()).to.eql('LOOK AT ME!!!!!');
    });
  });
});
