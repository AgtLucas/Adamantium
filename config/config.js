'use strict';

var path = require('path');
var _ = require('lodash');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var base = {
  app: {
    root: path.normalize(__dirname + '/..'),
    env: env
  }
};

var specific = {
  development: {
    app: {
      port: 3000,
      name: 'TalkHub - Dev',
      keys: ['super-secretz']
    },
    mongo: {
      url: 'mongodb://localhost/talkhub_dev'
    }
  },
  test: {
    app: {
      port: 3001,
      name: 'TalkHub - Test',
      keys: ['super-secretz']
    },
    mongo: {
      url: 'mongodb://localhost/talkhub_test'
    }
  },
  production: {
    app: {
      port: process.env.PORT || 3000,
      name: 'TalkHub'
    },
    mongo: {
      url: 'mongodb://localhost/talkhub' // <= Just for the sake of example
    }
  },
};

module.exports = _.merge(base, specific[env]);