var path = require('path')
var request = require('supertest')
var file = path.resolve('server.js')
var app = require(file)

describe('Session: routes', function () {

	it('should render login page', function(done) {
		request(app)
		.get('/login')
		.expect(200, done)
	})

	it('should be able to logout', function(done) {
		request(app)
		.get('/logout')
		.expect(302)
		.expect('Location', '/')
		.end(done)
	})

})
