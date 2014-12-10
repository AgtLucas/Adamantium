'use strict';

var bcrypt = require('../../lib/bcrypt-thunk');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var co = require('co');

const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: { type: String, required: true, unique: true, lowercase:true },
  password: { type: String, require: true },
},{
  toJSON: {
    transform: function (doc, ret, options) {
      delete ret.password;
    }
  }
});

// Middleware
UserSchema.pre('save', function (done) {
  if (!this.isModified('password')) {
    return done();
  }

  co(function *() {
    try {
      var salt = yield bcrypt.genSalt();
      var hash = yield bcrypt.hash(this.password, salt);
      this.password = hash;
      done();
    } catch (err) {
      done(err);
    }
  }).call(this, done);
});

// Methods
UserSchema.methods.comparePassword = function *(candidatePassword) {
  return yield bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.passwordMatches = function *(username, password) {
  var user = yield this.findOne({ 'username': username.toLowerCase() }).exec();
  if (!user) throw new Error('User not found!');

  if (yield user.comparePassword(password))
    return user;

  throw new Error('Password does not match!');
};

// Model Creation
mongoose.model('User', UserSchema);