'use strict';

var router = require('koa-router');
var indexController = require('../src/controllers/index');
var authController = require('../src/controllers/auth');

var secured = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
  }
};

module.exports = function (app, passport) {

  app.use(router(app));

  app.use('/login', authController.login);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=local'
  }));

  app.all('/logout', authController.logout);

  // Just for test
  app.get('/user/:username/:password', authController.createUser);

  app.get('/', function *() {
    if (this.isAuthenticated()) {
      yield indexController.index.apply(this);
    } else {
      this.redirect('/login')
    }
  });

  // Secured routes, keep out!
  /**
  * TODO!
  * Something like that:
  * app.get('/account', secured, userController.getAccount);
  *
  **/

};