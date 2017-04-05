var path = require('path')
var request = require('supertest')
var file = path.resolve('server.js')
var app = require(file)

describe('Basic routes', function () {

	it('should get home page', function (done) {

		request(app)
		.get('/')
		.expect(200, /Node Authentication/, done)
	})

	it('should generate a 404', function (done) {
		request(app)
		.get('/does_not_exist')
		.expect(404, /404/, done)
	})

})

