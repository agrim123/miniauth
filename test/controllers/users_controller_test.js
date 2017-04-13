const request = require('supertest')
const app = require('../../server.js')
const should = require('chai').should()
const expect = require('chai').expect
const agent = request.agent(app)
const mongoose = require('mongoose')
const User = require('../../app/models/user.js').User
var users_helper = require('../../app/helpers/users_helper.js')

var deleteAfterRun = true

var userDetails = { email: 'user@gmail.com', password: 'pass' }
var adminDetails = { email: 'admin@gmail.com', password: 'password' }

describe('Users Controller', () => {
  before(function (done) {
    var adminUser = new User()
    adminUser.local.email = 'admin@gmail.com'
    adminUser.local.password = users_helper.hashPassword('password')
    adminUser.role = 'admin'
    adminUser.save(done)
  })

  describe('check basic routes', () => {
    it('should not be allowed profile unless logged in', (done) => {
      agent
      .get('/profile')
      .expect(302, done)
    })

    it('should render signup page', (done) => {
      agent
      .get('/signup')
      .expect(200, done)
    })
  })

  describe('Authentication routes', () => {
    it('should correctly redirect to facebook', (done) => {
      agent
      .get('/auth/facebook')
      .end((err, res) => {
       expect(res.header['location']).to.contain('https://www.facebook.com/dialog/oauth?')
       done()
     })
    })

    it('should correctly redirect to google', (done) => {
      agent
      .get('/auth/google')
      .end((err, res) => {
       expect(res.header['location']).to.contain('https://accounts.google.com/o/oauth2/auth?')
       done()
     })
    })
  })

  describe('should create a session', () => {
    it('should be able to signup', (done) => {
      agent
      .post('/signup')
      .send(userDetails)
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

    it('should be able to login', (done) => {
      agent
      .post('/login')
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).to.equal(302)
        expect(res.header['location']).to.equal('/profile')
        done()
      })
    })

    it('should be able to logout after login', (done) => {
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
  })

  describe('Admin Routes', () => {
    it('should not be allowed admin access unless logged in', (done) => {
      agent
      .get('/admin')
      .end((err, res) => {
        expect(res.status).to.equal(302)
        expect(res.header['location']).to.equal('/')
        done()
      })
    })

    it('should be able to login as admin', (done) => {
      agent
      .post('/login')
      .send(adminDetails)
      .end((err, res) => {
        expect(res.status).to.equal(302)
        expect(res.header['location']).to.equal('/profile')
        done()
      })
    })

    it('should be allowed access to admin area', (done) => {
      agent
      .get('/admin')
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

    describe('Accessing admin routes using non admin accounts', () => {
      it('should be able to login', (done) => {
        agent
        .post('/login')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.equal(302)
          expect(res.header['location']).to.equal('/profile')
          done()
        })
      })

      it('should not be allowed admin access unless admin', (done) => {
        agent
        .get('/admin')
        .end((err, res) => {
          expect(res.status).to.equal(302)
          expect(res.header['location']).to.equal('/')
          done()
        })
      })

      it('should be able to logout after login', (done) => {
        agent
        .get('/logout')
        .end((err, res) => {
          expect(res.status).to.equal(302)
          expect(res.header['location'])
          .to.equal('/')
          done()
        })
      })
    })
  })

  after((done) => {
    if (deleteAfterRun) {
      mongoose.connection.db.dropDatabase()
      done()
    } else {
      console.log('Not deleting test database because it already existed before run')
      done()
    }
  })
})
