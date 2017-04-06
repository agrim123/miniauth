const request = require('supertest')
const app = require('../../server.js')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

describe('Sessions Controller', () => {
  it('should render login page', (done) => {
    request(app)
    .get('/login')
    .expect(200, done)
  })
})
