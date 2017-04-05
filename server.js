var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')
var path = require('path')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
require('dotenv').config()

mongoose.Promise = global.Promise

var configDB = require('./config/database.js')

// configuration ===============================================================
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(configDB.db)
}

require('./config/passport')(passport)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'app/views'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

require('./routes.js')(app, passport)

app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('errors/error.ejs')
})

app.listen(port)
console.log('The magic happens on port ' + port)
module.exports = app

//
/*

http://www.scotchmedia.com/tutorials/express/authentication/2/03

*/

//
