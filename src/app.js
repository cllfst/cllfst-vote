var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/ballots', require('./routes/ballot'))
app.use('/votes', require('./routes/vote'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    const devError = req.app.get('env') === 'development' ? err : {}
    const error = {
        message: err.message,
        status: err.status || 500,
        stack: devError.stack
    }
    
    // render the error page
    res.locals.error = error
    res.status(error.status).render('error')    
})

module.exports = app