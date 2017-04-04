'use strict';


// Modified from https://github.com/elliotf/mocha-mongoose


var config = require('../config/database.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';


beforeEach(function (done) {


  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return done();
  }


  function reconnect() {
    mongoose.connect(config.db.test, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  }


  function checkState() {
    switch (mongoose.connection.readyState) {
    case 0:
      reconnect();
      break;
    case 1:
      clearDB();
      break;
    default:
      process.nextTick(checkState);
    }
  }


  checkState();
});


afterEach(function (done) {
  mongoose.disconnect();
  return done();
});
