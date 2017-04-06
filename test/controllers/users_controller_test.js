const request = require('supertest')
const app = require('../../server.js')
const should = require('chai').should()
const expect = require('chai').expect
const agent = request.agent(app)
const mongoose = require('mongoose')

var deleteAfterRun = true
var loginDetails = { email: 'user@gmail.com', password: 'pass' }

describe('Users Controller', () => {
  describe('check basic routes', () => {
    it('should not be allowed profile unless logged in', (done) => {
      request(app)
      .get('/profile')
      .expect(302, done)
    })

    it('should render signup page', (done) => {
      request(app)
      .get('/signup')
      .expect(200, done)
    })
  })

  describe('Authentication routes', () => {
    it('should correctly redirect to facebook', (done) => {
      request(app)
      .get('/auth/facebook')
      .end((err, res) => {
       expect(res.header['location']).to.contain('https://www.facebook.com/dialog/oauth?')
       done()
     })
    })

    it('should check the returned json from facebook', (done) => {
      done()
    })

    it('should correctly redirect to google', (done) => {
      request(app)
      .get('/auth/google')
      .end((err, res) => {
       expect(res.header['location']).to.contain('https://accounts.google.com/o/oauth2/v2/auth?')
       done()
     })
    })
  })

  describe('should create a session', () => {
    it('should be able to signup', (done) => {
      agent
      .post('/signup')
      .send(loginDetails)
      .end((err, res) => {
        expect(res.status).to.equal(302)
        expect(res.header['location']).to.equal('/profile')
        done()
      })
    })

    it('should be able to visit profile', (done) => {
      agent
      .get('/profile')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        done()
      })
    })

    it('should be able to logout', (done) => {
      agent
      .get('/logout')
      .end((err, res) => {
        expect(res.status).to.equal(302)
        expect(res.header['location'])
        .to.equal('/')
        done()
      })
    })

    it('should not be able to visit profile after logout', (done) => {
      agent
      .get('/profile')
      .end((err, res) => {
        expect(res.status).to.equal(302)
        expect(res.header['location']).to.equal('/')
        done()
      })
    })

    it('should be able to login', (done) => {
      agent
      .post('/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res.status).to.equal(302)
        expect(res.header['location']).to.equal('/profile')
        done()
      })
    })
  })

  after((done) => {
    if (deleteAfterRun) {
      console.log('Deleting test database')
      mongoose.connection.db.dropDatabase(done)
    } else {
      console.log('Not deleting test database because it already existed before run')
      done()
    }
  })
})
