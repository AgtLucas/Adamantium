'use strict';

var bcrypt = require('../lib/bcrypt-thunk');
var should = require('should');

// ES6 Generators, bitch!
var co = require('co');

const PASSWORD = 'wtf';
const SALT = '$2a$10$zyParsk87TjIfgPFsOC2HO';
const HASH = '$2a$10$zyParsk87TjIfgPFsOC2HOnXu3azSlVkpf9L48qJcFcCofF4eDqeW';
const ROUNDS = 10;

describe('Bcrypt Thunk\'ed', function () {
  describe('Salt', function () {
    it('Should generate salt', co(function *() {
      var salt = yield bcrypt.genSalt(ROUNDS);
      should.exist(salt);
      salt.length.should.be.above(0);
      salt.should.match(new RegExp('\\$.{2}\\$' + ROUNDS + '\\$.{22}'));
    }));
    it('Should throw on bad road', co(function *() {
      try {
        yield bcrypt.genSalt('b');
        should.fail('Should have thrown an error');
      } catch (err) {
        should.exist(err);
      }
    }));
  });

  describe('Hash, bitch!', function () {
    it('Should hash password', co(function *() {
      var hash = yield bcrypt.hash(PASSWORD, SALT);
      should.exist(hash);
      hash.length.should.be.above(0);
      hash.should.equal(HASH);
    }));
    it('should throw on bad salt', co(function *() {
      try {
        yield bcrypt.hash(PASSWORD, 'BAD_SALT');
        should.fail('should have thrown an error');
      } catch (err) {
        should.exist(err);
      }
    }));
  });

  describe('Match', function () {
    it('Should match passwords', co(function *() {
      var match = yield bcrypt.compare(PASSWORD, HASH);
      match.should.be.true;
    }));
    it('Should not match passwords', co(function *() {
      var match = yield bcrypt.compare(PASSWORD + 'ERROR', HASH);
      match.should.be.false;
    }));
  });

});