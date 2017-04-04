// config/database.js
require('dotenv').config()
module.exports = {
  db: process.env.DATABASE_URL
}
