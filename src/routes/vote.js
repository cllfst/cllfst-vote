'use strict'

const express = require('express')
const router = express.Router()
const moment = require('moment')
const utils = require('../util/utils')
const db = require('../models/db')

router.get('/:ballotName', async function (req, res, next) {

    const ballotName = req.params.ballotName
    const votingToken = req.query.token
    const ballot = await db.findBallotByName(ballotName)
    const check = runCheck(ballot, votingToken)
    if (check.isError) {
        return res.render('error', check.details)
    }
    const candidatesPerRole = getCandidatesPerRole(ballot)
    return res.render('vote', { token: votingToken, roles: utils.roles,
        candidatesPerRole: candidatesPerRole })
})

router.post('/:ballotName', async function (req, res, next) {

    const ballotName = req.params.ballotName
    const votingToken = req.query.token
    const vote = req.body

    const ballot = await db.findBallotByName(ballotName)
    const check = runCheck(ballot, votingToken)
    if (check.isError) {
        return res.render('error', check.details)
    }
    if (!isValidVote(ballot, vote)) {
        return res.render('error', utils.viewData(400, 'Invalid vote'))
    }

    registerVote(ballot, vote)
    expireToken(ballot, votingToken)
    await db.updateBallot(ballot)
    res.render('success', { status: 200, message: 'Bravo!' })
})

function runCheck(ballot, votingToken) {
    if (!ballot) {
        return utils.error(404, 'Ballot not found!')
    }

    // check dates
    const startDate = moment(ballot.startDate).utc()
    const endDate = moment(ballot.endDate).utc()
    const now = moment().utc()
    if (now.isBefore(startDate)) {
        return utils.error(401,'Ballot is not open yet!')
    }
    if (now.isAfter(endDate)) {
        return utils.error(401, 'Ballot is closed!')
    }

    // check authorization token
    const isValid = ballot.tokens.includes(votingToken)
    const isExpired = ballot.expiredTokens.includes(votingToken)
    if (!isValid && !isExpired) {
        return utils.error(401, 'Invalid token!')
    }
    if (isExpired) {
        return utils.error(401, "Token expired!")
    }

    return {isError: false}
}

function getCandidatesPerRole(ballot) {
    const candidatesPerRole = {}
    for (const role of utils.roles) {
        candidatesPerRole[role] = []
    }

    for (const candidate of ballot.candidates) {
        candidatesPerRole[candidate.role].push(candidate.name)
    }
    return candidatesPerRole
}

function isValidVote(ballot, vote) {
    if (!vote || Object.keys(vote) === 0) {
        return false
    }

    for (let role of Object.keys(vote)) {
        if (vote[role] != 'null') {
            const test = e => e.role == role && e.name == vote[role]
            if (!ballot.candidates.some(test)) {
                return false
            }
        }
    }
    return true
}

function registerVote(ballot, vote) {
    for (let role of Object.keys(vote)) {
        if (vote[role] != 'null') {
            const test = e => e.role === role && e.name === vote[role]
            const foundCandidate = ballot.candidates.find(test)
            if (!foundCandidate) {
                console.error(`Cannot vote for ${vote[role]} as ${role}`)
            } else {
                foundCandidate.votes += 1
            }
        }
    }
}

function expireToken(ballot, token) {
    const index = ballot.tokens.indexOf(token)
    if (index > -1) {
        ballot.tokens.splice(index, 1)
    }
    ballot.expiredTokens.push(token)
}

module.exports = router
