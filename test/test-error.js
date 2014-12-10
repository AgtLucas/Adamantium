var should = require('should');
var app = require('../app');
var request = require('supertest').agent(app.listen());

describe('Errors', function () {
  it('Should return 404', function (done) {
    request.get('/urlWhatever')
      .expect(404)
      .end(done);
  });
});