'use strict';

var utils = require('../utils');

var path = require('path');
var file = path.resolve('server.js')
var app = require(file)
var should = require('should');
var request = require('supertest');
var User = require('../../app/models/user.js');

var users_helper  =require('../../app/helpers/users_helper.js');

describe('Passport: routes', function () {

  var baseUrl = '/login';
  var emailAddress = 'berry@example.com';
  var realPassword = 'secret1';

  beforeEach(function (done) {
    var passwordHash = users_helper.hashPassword(realPassword);
    var newUser = new User;
    newUser.local.email = emailAddress;
    newUser.local.password = passwordHash;
    newUser.save(function (err) {
      done();
    });
  });

  describe('Local Routes', function () {

    it('should redirect to "/profile" if authentication is successfull', function (done) {
      var post = {
        email: 'berry@example.com',
        password: realPassword
      };
      request(app)
      .post(baseUrl)
      .send(post)
      .expect(302)
      .expect('Location', '/profile')
      .end(done)
    });

    it('should redirect to "/login" if authentication fails', function (done) {
      var post = {
        email: 'berry@example.com',
        password: 'fakepassword'
      };
      request(app)
      .post(baseUrl)
      .send(post)
      .expect(302)
      .expect('Location', '/login')
      .end(done)
    });
  });

  describe('Facebook Routes', function() {

    it('should require authorization', function(done) {
      request(app)
      .get('/auth/facebook')
      .expect(302)
      .expect('Location', /https:\/\/www.facebook.com\/dialog\/oauth\?response_type=code&redirect_uri=/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
    });
  })

  describe('Google Routes', function() {

    it('should require authorization', function(done) {
      request(app)
      .get('/auth/google')
      .expect(302)
      .expect('Location', /https:\/\/accounts.google.com\/o\/oauth2\/v2\/auth\?response_type=code&redirect_uri=/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
    });
  })

});
