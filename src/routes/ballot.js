const express = require('express')
const router = express.Router()
const utils = require('../util/utils')
const db = require('../models/db')


router.post('/', function(req, res, next) {
    const authorization = req.headers.authorization
    const emails = req.body.emails
    const subject = req.body.subject

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

    console.log('\n#######################')
    console.log('# Initializing ballot #')
    console.log('#######################\n')

    const savedBallot = db.initNewBallot("test")
    console.log(savedBallot)

    const array = []
    emails.forEach(to => {
        const subject = "CLLFST Elections"
        const votingLink = utils.createVotingLink()
        const body = 'Please use the following link to vote: '
                + votingLink
        db.addTokenToBallot("test", votingLink.split('/')[1])
        array.push({to: to, subject: subject, body: body})
        utils.sendEmail(to, subject, body)
    })

    res.json({"result": "true", "data": array})
})

module.exports = router
