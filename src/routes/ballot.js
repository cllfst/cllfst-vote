'use strict'

const express = require('express')
const router = express.Router()
var Url = require('url-parse')
const utils = require('../util/utils')
const appEnv = require('../util/app-env')
const db = require('../models/db')

router.post('/', function(req, res, next) {
    const authorization = req.headers.authorization
    const emails = req.body.emails
    const subject = req.body.subject
    const ballotName = req.body.ballotName
    const candidates = req.body.candidates

    if (!utils.isAdmin(authorization)) {
        return res.sendStatus(401)
    }

    if (!subject || !ballotName || !Array.isArray(emails) || !Array.isArray(candidates)) {
        return res.status(400)
        .send("Missing some ballot's info! Ballot must have:"
        + " a ballotName, a candidate list, a subject and an email list.")
    }

    if (!isValidCandidateList(candidates)) {
        return res.status(400)
            .send("Invalid candidate list")
    }

    const data = init(ballotName, candidates, subject, emails)
        .then(data => res.json({"result": "true", "data": data}))
        .catch(err => res.json({"error": err.message}))
    
})

async function init(ballotName, candidates, subject, emails) {
    console.log('\n#######################')
    console.log('# Initializing ballot #')
    console.log('#######################\n')

    ////////////////////
    await db.removeBallotByName(ballotName) // TODO: remove this /!\
    ////////////////////

    initVotesForCandidates(candidates)
    const newBallot = await db.newBallot(ballotName, candidates)
    console.log('Created ballot [name:{}]', newBallot.name)

    const array = []
    const senderEmail = appEnv.senderEmail
    const senderPassword = appEnv.senderPassword
    for (const to of emails) {
        const subject = "CLLFST Elections"
        const votingUrl = createVotingLink()
        const body = 'Please use the following link to vote: '
                + votingUrl
        db.addTokenToBallot(ballotName, votingUrl.query.token)
        array.push({to: to, subject: subject, body: body})
        // utils.sendEmail(senderEmail, senderPassword, to, subject, body)
    
    }
    return array
}

function isValidCandidateList(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
        return false
    }
    return candidates.every(candidate =>
        candidate.name && candidate.role && utils.isValidRole(candidate.role)
    )
}

function initVotesForCandidates(candidates) {
    candidates.forEach(candidate => {
        candidate.votes = 0
    })
}

function createVotingLink() {
    var accessToken = utils.generateRandomString()
    return new Url('https://' + appEnv.domainName + '/votes?token=' + accessToken, true)
}

module.exports = router
