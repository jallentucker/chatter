'use strict';

window.Chatter = Ember.Application.create();
Chatter.AdmitOneContainers = {}; // overridable by tests
Ember.AdmitOne.setup({ containers: Chatter.AdmitOneContainers });

Chatter.Router.map(function() {
  this.route('signup');
  this.route('login');
  this.route('logout');
  this.route('profile');
});

Chatter.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

// authenticate any route
Chatter.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
});

Chatter.User = DS.Model.extend({
  username: DS.attr('string'),
  password: DS.attr('string')
});

Chatter.LoginRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    if (this.get('session').get('isAuthenticated')) {
      this.transitionTo('profile');
    }
  }
});

Chatter.LoginController = Ember.Controller.extend({
  actions: {
    authenticate: function() {
      var self = this;
      var session = this.get('session');
      var credentials = this.getProperties('username', 'password');
      this.set('error', undefined);
      this.set('password', undefined);
      session.authenticate(credentials).then(function() {
        var attemptedTransition = self.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry();
          self.set('attemptedTransition', null);
        } else {
          self.transitionToRoute('profile');
        }
      })
      .catch(function(error) {
        self.set('error', error);
      });
    }
  }
});

Chatter.LogoutRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    var self = this;
    var session = this.get('session');
    return session.invalidate().finally(function() {
      self.transitionTo('index');
    });
  }
});

Chatter.SignupRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('user');
  }
});

Chatter.SignupController = Ember.ObjectController.extend({
  actions: {
    signup: function() {
      var session = this.get('session');
      var self = this;

      this.set('error', undefined);
      this.get('model').save() // create the user
      .then(function() {
        session.login({ username: self.get('model.username') });
        self.transitionToRoute('profile');
      })
      .catch(function(error) {
        if (error.responseJSON) { error = error.responseJSON; }
        if (error.error) { error = error.error; }
        self.set('error', error);
      });
    }
  }
});
