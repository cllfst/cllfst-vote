'use strict'

const express = require('express')
const router = express.Router()
const moment = require('moment')
const utils = require('../util/util')
const env = require('../util/env')
const db = require('../db/db')

router.get('/', function(req, res, next) {
    // TODO: add form to create ballots
    return res.render('ballot/ballot-view')
})

router.post('/', async function(req, res, next) {
    const authorization = req.headers.authorization
    if (!utils.isAdmin(authorization)) {
        return res.render('misc/error', {status: 401, message: 'Unauthorized'})
    }

    if (!isValidBallotDesc(req.body)) {
        const msg = "Invalid ballot description! "
            + "You must provide those valid elements: "
            + "ballotName, candidates, startDate, endDate, "
            + "subject, text and emails."
        return res.status(400).json({ "error": msg })
    }

    if (!isValidCandidateList(req.body.candidates)) {
        return res.render('misc/error', {status: 400, message: 'Invalid candidate list'})
    }

    const response = await createBallot(req.body)
    return res.status(200).json({"result": response})
})

async function createBallot(ballot) {
    console.log('=> Creating ballot')

    ////////////////////
    // TODO: remove this /!\
    await db.removeBallotByName(ballot.ballotName)
    // if (await db.findBallotByName(ballotName)) {
    //     res.status(400).json({"error": "Duplicate ballot name"})
    // }
    ////////////////////

    initVotesForCandidates(ballot.candidates)
    const newBallot = await db.newBallot(ballot)
    console.log(`=> Created ballot [name:${newBallot.ballotName}]`)

    for (const to of ballot.emails) {
        const votingToken = utils.generateRandomString()
        const votingUrl = createVotingLink(ballot.ballotName, votingToken)
        const body = ballot.text.replace('{}', votingUrl)
        db.addTokenToBallot(ballot.ballotName, votingToken)
        if (env.nodeEnv === 'production') {
            utils.sendEmail(to, ballot.subject, body)
        }
    }
    return 'ok'
}

function isValidBallotDesc(ballot) {
    const notNull = ballot.ballotName && ballot.startDate && ballot.endDate
        && ballot.subject && ballot.text
        && Array.isArray(ballot.emails) && Array.isArray(ballot.candidates)

    ballot.startDate = moment(ballot.startDate).utc()
    ballot.endDate = moment(ballot.endDate).utc()
    const now = moment().utc()
    return notNull && now.isBefore(ballot.startDate) && ballot.startDate.isBefore(ballot.endDate)
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
    return env.protocol + '://' + env.domainName
        + '/votes/' + ballotName + '?token=' + votingToken
}

module.exports = router
