'use strict'

const express = require('express')
const router = express.Router()
const moment = require('moment')
const db = require('../db/db')
const utils = require('../util/util')

router.get('/:ballotName', async function (req, res, next) {
    const ballotName = req.params.ballotName
    const ballot = await db.findBallotByName(ballotName)
    const check = runCheck(ballot)
    if (check.isError) {
        return res.render('error/error-view', check)
    }

    const candidatesPerRolePerVote = getCandidatesPerRolePerVote(ballot)
    return res.render('result/result-view', {
        roles: utils.roles,
        candidatesPerRolePerVote: candidatesPerRolePerVote
    })
})

function runCheck(ballot) {
    if (!ballot) {
        return utils.failedCheck(404, 'Ballot not found!')
    }

    // check dates
    const startDate = moment(ballot.startDate).utc()
    const endDate = moment(ballot.endDate).utc()
    const now = moment().utc()
    if (now.isBefore(startDate)) {
        return utils.failedCheck(401, 'Ballot is not open yet! Please revisit' +
            ' us after the end of the vote on', ballot.endDate)
    }
    if (now.isBefore(endDate)) {
        return utils.failedCheck(401, 'Ballot is still active! Please revisit' +
            ' us after the end of the vote on', ballot.endDate)
    }
    return {
        isError: false
    }
}

function getCandidatesPerRolePerVote(ballot) {
    const candidatesPerRolePerVote = {}
    for (const role of utils.roles) {
        candidatesPerRolePerVote[role] = []
    }
    for (const candidate of ballot.candidates) {
        candidatesPerRolePerVote[candidate.role].push({
            name: candidate.name,
            votes: candidate.votes
        })
    }
    return candidatesPerRolePerVote
}

module.exports = router