'use strict';

var fs = require('fs');
var koa = require('koa');
var mongoose = require('mongoose');
var passport = require('koa-passport');

// Config
var config = require('./config/confg');

// DB!
mongoose.connect(config.mongo.url);
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Load models!
var models_path = config.app.root + '/src/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('js')) {
    require(models_path + '/' + file);
  }
});

// Server!
var app = module.exports = koa();

require('./config/passport')(passport, config);
require('./config/koa')(app, config, passport);

// Routes!
require('./config/routes')(app, passport);

// Start app!
if (!module.parent) {
  app.listen(config.app.port);
  console.log('Server started! Listening on port: ' + config.app.port);
};
console.log('Environment: ' + config.app.env);