'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('chirps', function(table) {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('content').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chirps');
};
