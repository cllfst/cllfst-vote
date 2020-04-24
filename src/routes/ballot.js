const express = require('express')
const router = express.Router()
var Url = require('url-parse');
const utils = require('../util/utils')
const db = require('../models/db')


router.post('/', function(req, res, next) {
    const authorization = req.headers.authorization
    const emails = req.body.emails
    const subject = req.body.subject
    const ballotName = req.body.ballotName

    if (authorization !== process.env.ADMIN_PASSWORD) {
        return res.sendStatus(401)
    }

    if (!subject || !ballotName || !Array.isArray(emails)) {
        return res.status(400)
            .send("Please provide all the ballot's info"
            + " (subject, ballotName, emails)!")
    }

    console.log('\n#######################')
    console.log('# Initializing ballot #')
    console.log('#######################\n')

    db.initNewBallot(ballotName)
    console.log('Created ballot: ' + ballotName)

    const array = []
    const senderEmail = process.env.SENDER_EMAIL
    const senderPassword = process.env.SENDER_PASSWORD
    emails.forEach(to => {
        const subject = "CLLFST Elections"
        const votingUrl = createVotingLink()
        const body = 'Please use the following link to vote: '
                + votingUrl
        db.addTokenToBallot(ballotName, votingUrl.query.token)
        array.push({to: to, subject: subject, body: body})
        utils.sendEmail(senderEmail, senderPassword, to, subject, body)
    })

    res.json({"result": "true", "data": array})
})

function createVotingLink() {
    var accessToken = utils.generateRandomString();
    // return 'https://' + process.env.DOMAIN_NAME + '/votes/' + accessToken
    return new Url('https://' + process.env.DOMAIN_NAME + '/votes?token=' + accessToken)
}

module.exports = router
