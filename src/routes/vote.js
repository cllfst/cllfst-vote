var express = require('express');
var router = express.Router();
const utils = require('../util/utils')
const db = require('../models/db')

router.get('/:ballotName', async function (req, res, next) {

    const ballotName = req.params.ballotName
    const votingToken = req.query.token
    const ballot = await db.findBallotByName(ballotName)
    if (!ballot) {
        // return html page instead
        return res.render('error', { status: 400, message: 'No ballot found!' })
    }

    // TODO: /!\ check start/end date for ballot
    // console.log(isBeforeDeadline(ballot))

    const tokenStatus = checkVotingToken(ballot, votingToken)
    if (tokenStatus.notFound) {
        return res.render('error', { status: 401, message: 'Invalid token!' });
    }
    if (tokenStatus.isExpired) {
        return res.render('error', { status: 401, message: "Token expired, you have already voted!" });
    }
    const candidatesPerRole = getCandidatesPerRole(ballot)
    return res.render('vote', { token: votingToken, roles: utils.roles, candidatesPerRole: candidatesPerRole })
})

router.post('/:ballotName', async function (req, res, next) {

    const ballotName = req.params.ballotName
    const votingToken = req.query.token
    const vote = req.body

    const ballot = await db.findBallotByName(ballotName)
    if (!ballot) {
        return res.render('error', { status: 404, message: "Ballot not found" });
    }

    // TODO: /!\ check start/end date for ballot
    // console.log(isBeforeDeadline(ballot))

    const tokenStatus = checkVotingToken(ballot, votingToken)
    if (tokenStatus.notFound) {
        return res.render('error', { status: 401, message: 'Token not found' });
    }
    if (tokenStatus.isExpired) {
        return res.render('error', { status: 401, message: "Token expired" });
    }

    if (!isValidVote(ballot, vote)) {
        return res.render('error', { status: 400, message: 'Invalid vote' });
    }

    registerVote(ballot, vote)
    expireToken(ballot, votingToken)
    await db.updateBallot(ballot)
    res.render('success', { status: 200, message: 'Bravo!' })
});

function isBeforeDeadline(ballot) {
    return Date.now() < ballot.endDate.getTime()
}

function checkVotingToken(ballot, votingToken) {
    const isValid = ballot.tokens.includes(votingToken)
    const isExpired = ballot.expiredTokens.includes(votingToken)
    return {
        isExpired: isExpired,
        notFound: !isValid && !isExpired
    }
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
                console.error(`Cannot vote for ${vote[role]} as ${role}`);
            }
            foundCandidate.votes += 1
        }
    }
}

function expireToken(ballot, token) {
    const index = ballot.tokens.indexOf(token);
    if (index > -1) {
        ballot.tokens.splice(index, 1);
    }
    ballot.expiredTokens.push(token)
}

module.exports = router;
