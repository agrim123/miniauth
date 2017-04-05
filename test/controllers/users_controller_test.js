const request = require('supertest')
const app = require('../../server.js')

describe('GET /profile', function () {
	it('should not be allowed profile unless logged in', function (done) {
    request(app)
    .get('/profile')
    .expect(302, done)
  })
})

describe('GET /signup', function () {

  it('should return 200 OK', function (done) {
    request(app)
    .get('/signup')
    .expect(200, done)
  })
})

