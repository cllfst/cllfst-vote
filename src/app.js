'use strict'

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express()

// view engine setup
app.set('views', path.join(__dirname))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./home/home-router'))
app.use('/ballots', require('./ballot/ballot-router'))
app.use('/votes', require('./vote/vote-router'))
app.use('/results', require('./result/result-router'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    const isDevMode = req.app.get('env') === 'development'
    let message = err.message

    if (!isDevMode && err.status != 404) {
        message = 'Oops something went wrong!'
    }

    const error = {
        message: message,
        status: err.status || 500,
        stack: isDevMode ? err.stack : ''
    }
    
    // render the error page
    res.locals.error = error
    res.status(error.status).render('error/error-view')
})

module.exports = app