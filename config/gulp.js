'use strict';

var root = require('path').normalize(__dirname + '/..');

module.exports = {
  paths: {
    'in': {
      sass: root + '/src/client/sass/*.scss',
      jsx: root + '/src/client/**/*.jsx',
      js: root + '/src/client/**/*.js',
      app: root + '/build/app'
    },
    out: {
      build_js: root + '/build',
      public: root + '/public',
    },
    toWatch: [root + '/src/**/*.js', root + '/config/*.js', root + '/server.js', root + '/lib/*.js']
  }
};
