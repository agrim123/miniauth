var path = require('path')
var request = require('supertest')
var file = path.resolve('server.js')
var app = require(file)

describe('User: routes', function () {

	it('should not be allowed profile unless logged in', function (done) {
		request(app)
		.get('/profile')
		.expect(302)
		.expect('Location', '/')
		.end(done)
	})

	it('should render signup page', function(done) {
		request(app)
		.get('/signup')
		.expect(200, done)
	})

})
