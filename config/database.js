// config/database.js
require('dotenv').config()
module.exports = {
  db: {
    'dev': process.env.DATABASE_URL,
  }
}
