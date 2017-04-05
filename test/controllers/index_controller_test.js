const request = require('supertest')
const app = require('../../server.js')

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done)
  })
})

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/random')
      .expect(404, done)
  })
})
