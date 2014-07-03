'use strict';

var config = require('./config');
var knexConfig = require('../knexfile')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User, Token, Chirp;
User = bookshelf.Model.extend({
  tokens: function() {
    return this.hasMany(Token);
  },
  tableName: 'users'
});
Token = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  tableName: 'tokens'
});
Chirp = bookshelf.Model.extend({
  tableName: 'chirps'
});

module.exports = {
  User: User,
  Token: Token,
  Chirp: Chirp
};
