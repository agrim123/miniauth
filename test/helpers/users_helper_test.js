'use strict'

var should = require('should')

var users_helper = require('../../app/helpers/users_helper.js')

describe('Users helpers', () => {

  describe('#hashPassword()', () => {
    it('should return a hashed password asynchronously', (done) => {
      var password = 'secret'
      users_helper.hashPassword(password, (err, passwordHash) => {
        should.not.exist(err)
        should.exist(passwordHash)
      })
      done()
    })
  })

  describe('#comparePasswordAndHash()', () => {
    it('should return true if password is valid', (done) => {
      var password = 'secret'
      users_helper.hashPassword(password, (err, passwordHash) => {
        comparePasswordAndHash(password, passwordHash, (err, areEqual) => {
          should.not.exist(err)
          areEqual.should.equal(true)
        })
      })
      done()
    })

    it('should return false if password is invalid', (done) => {
      var password = 'secret'
      users_helper.hashPassword(password, (err, passwordHash) => {
        var fakePassword = 'imahacker'
        comparePasswordAndHash(fakePassword, passwordHash, (err, areEqual) => {
          should.not.exist(err)
          areEqual.should.equal(false)
        })
      })
      done()
    })
  })
})
