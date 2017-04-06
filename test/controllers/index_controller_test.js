const request = require('supertest')
const app = require('../../server.js')

describe('Index Controller', () => {
  it('should render root page', (done) => {
    request(app)
    .get('/')
    .expect(200, done)
  })

  it('should return 404 for non-existent pages', (done) => {
    request(app)
    .get('/random')
    .expect(404, done)
  })
})
