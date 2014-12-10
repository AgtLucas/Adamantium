'use strict';

var should = require('should');
var mongoose = require('mongoose');

var User = mongoose.model('User');

const CREDENTIALS = {
  u: 'a@a.com',
  p: '1234567'
};

exports.LOGIN_URL = '/login';

exports.createUser = function *() {
  var user = new User({
    username: CREDENTIALS.u,
    password: CREDENTIALS.p
  });
};

exports.signAgent = function *(agent, done) {
  agent
    .post(exports.LOGIN_URL)
    .set('Content-Type', 'application/json')
    .send({ username: CREDENTIALS.u, password: CREDENTIALS.p })
    .redirects(false)
    .expect(302)
    .end(function (err, res) {
      if (err) done(err);
      try {
        res.header.location.should.equal('/');
        done();
      } catch (err) {
        done(err);
      }
    });
};