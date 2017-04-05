'use strict'


// import the moongoose helper utilities
var utils = require('../utils')
var should = require('should')
var bcrypt   = require('bcrypt-nodejs')
// import our User mongoose model
var User = require('../../app/models/user.js').User

var users_helper  =require('../../app/helpers/users_helper.js')

describe('Users: models', function () {

  describe('#create()', function () {
    it('should create a new User', function (done) {
      var newUser = new User
      newUser.local.email    = 'test@test.com'
      newUser.local.password = users_helper.hashPassword('password')
      newUser.save(function (err, createdUser) {
        should.not.exist(err)
        createdUser.local.email.should.equal('test@test.com')
        done()
      })
    })
  })

})

