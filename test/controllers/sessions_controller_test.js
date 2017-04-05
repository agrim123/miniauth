const request = require('supertest')
const app = require('../../server.js')

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/login')
      .expect(200, done)
  })
})
