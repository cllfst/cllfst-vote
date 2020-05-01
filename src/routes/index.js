'use strict'

var express = require('express')
var router = express.Router()
const db = require('../models/db')

router.get('/', async function(req, res, next) {

    res.render('index', {
        openBallots: await db.getOpenBallots(),
        recentlyClosedBallots: await db.getRecentlyClosedBallots()
    })
})

module.exports = router
