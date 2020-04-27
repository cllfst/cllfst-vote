'use strict'

const express = require('express')
const router = express.Router()
const momentTimezone = require('moment-timezone')
const moment = require('moment')

const utils = require('../util/utils')
const appEnv = require('../util/app-env')
const db = require('../models/db')

// TODO: return a form to create ballots
router.get('/', function(req, res, next) {res.send('<h1> WIP... </h1>')})

router.post('/', async function(req, res, next) {
    const authorization = req.headers.authorization
    if (!utils.isAdmin(authorization)) {
        return res.render('error', {status: 401, message: 'Unauthorized'});
    }

    if (!isValidBallotDesc(req.body)) {
        const msg = "Invalid ballot description! "
            + "You must provide those valid elements: "
            + "ballotName, candidates, startDate, endDate, "
            + "subject, text and emails."
        return res.status(400).json({ "error": msg });
    }

    if (!isValidCandidateList(req.body.candidates)) {
        return res.render('error', {status: 400, message: 'Invalid candidate list'});
    }

    const response = await init(req.body)
    return res.status(200).json({"result": response})
})

async function init(ballot) {
    console.log('\n#######################')
    console.log('# Initializing ballot #')
    console.log('#######################\n')

    ////////////////////
    // TODO: remove this /!\
    await db.removeBallotByName(ballot.ballotName)
    // if (await db.findBallotByName(ballotName)) {
    //     res.status(400).json({"error": "Duplicate ballot name"})
    // }
    ////////////////////

    initVotesForCandidates(ballot.candidates)
    const newBallot = await db.newBallot(ballot)
    console.log(`Created ballot [name:${newBallot.ballotName}]`)

    const senderEmail = appEnv.senderEmail
    const senderPassword = appEnv.senderPassword
    for (const to of ballot.emails) {
        const votingToken = utils.generateRandomString()
        const votingUrl = createVotingLink(ballot.ballotName, votingToken)
        const body = ballot.text.replace('{}', votingUrl)
        db.addTokenToBallot(ballot.ballotName, votingToken)
        // utils.sendEmail(senderEmail, senderPassword, to, ballot.subject, body)    
    }
    return 'ok'
}

function isValidBallotDesc(ballot) {
    const notNull = ballot.ballotName && ballot.startDate && ballot.endDate
        && ballot.subject && ballot.text
        && Array.isArray(ballot.emails) && Array.isArray(ballot.candidates)

    ballot.startDate = new Date(ballot.startDate)
    ballot.endDate = new Date(ballot.endDate)

    console.log('received: ' + ballot.startDate.toISOString())
    console.log('received moment: ' + moment(ballot.startDate).format())
    console.log('received moment utc: ' + moment(ballot.startDate).utc().format())
    console.log('now iso: ' + new Date().toISOString())
    console.log('moment now: ' + moment().format())
    console.log('moment now utc: ' + moment().utc().format())

    const validDates = ballot.startDate.getTime() < ballot.endDate.getTime()
        && Date.now() < ballot.endDate.getTime()
    return notNull && validDates
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

function createVotingLink(ballotName, votingToken) {
    return appEnv.protocol + '://' + appEnv.domainName
        + '/votes/' + ballotName + '?token=' + votingToken
}

module.exports = router
