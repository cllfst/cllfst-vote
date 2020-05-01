'use strict'

var express = require('express')
var router = express.Router()
const db = require('../db/db')

router.get('/', async function(req, res, next) {

    res.render('home/home-view', {
        openBallots: await db.getOpenBallots(),
        recentlyClosedBallots: await db.getRecentlyClosedBallots()
    })
})

module.exports = router
