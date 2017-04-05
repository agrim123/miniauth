'use strict'

var should = require('should')
var bcrypt   = require('bcrypt-nodejs')

var users_helper = require('../../app/helpers/users_helper.js')

describe('Users: helpers', function () {

  describe('#hashPassword()', function () {
    it('should return a hashed password asynchronously', function (done) {
      var password = 'secret'
      users_helper.hashPassword(password, function (err, passwordHash) {
        should.not.exist(err)
        should.exist(passwordHash)
      })
      done()
    })
  })

  describe('#comparePasswordAndHash()', function () {
    it('should return true if password is valid', function (done) {
      var password = 'secret'
      users_helper.hashPassword(password, function (err, passwordHash) {
        comparePasswordAndHash(password, passwordHash, function (err, areEqual) {
          should.not.exist(err)
          areEqual.should.equal(true)
        })
      })
      done()
    })

    it('should return false if password is invalid', function (done) {
      var password = 'secret'
      users_helper.hashPassword(password, function (err, passwordHash) {
        var fakePassword = 'imahacker'
        comparePasswordAndHash(fakePassword, passwordHash, function (err, areEqual) {
          should.not.exist(err)
          areEqual.should.equal(false)
        })
      })
      done()
    })
  })
})
