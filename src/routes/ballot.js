var express = require('express')
var router = express.Router()
var utils = require('../util/utils')

/* GET home page. */
router.post('/', function(req, res, next) {
    var authorization = req.headers.authorization
    var emails = req.body.emails
    var subject = req.body.subject

    if (authorization !== process.env.ADMIN_PASSWORD) {
        return res.sendStatus(401)
    }

    if (!Array.isArray(emails)) { // or null, undefined
        return res.status(400)
                .send("Please provide an emails list!")
    }

    if (!subject) { // or null, undefined
        return res.status(400)
                .send("Please provide the email's subject!")
    }

    console.log('Initializing ballot')
    var array = []

    emails.forEach(to => {
        var subject = "CLLFST Elections"
        var body = 'Please use the following link to vote: '
                + utils.createVotingLink()
        // TODO: write code to db
        console.log(`to: ${to}`)
        array.push({to: to, subject: subject, body: body})
        utils.sendEmail(to, subject, body)
    })

    res.json({"result": "true", "data": array})
})

module.exports = router
