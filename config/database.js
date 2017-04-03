// config/database.js
require('dotenv').config();
module.exports = {
	db: {
		'dev': process.env.DATABASE_URL,
		'test': process.env.TEST_DATABASE_URL
	}

};
