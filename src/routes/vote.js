var express = require('express');
var router = express.Router();
const utils = require('../util/utils')
// const appEnv = require('../util/app-env')
const db = require('../models/db')

router.get('/:ballotName', async function(req, res, next) {
    const ballotName = req.params.ballotName
    const ballot = await db.findBallotByName(ballotName)
    if (!ballot) {
        // return html page instead
        return res.status(400).json({"error": "No ballot found"})
    }
    return res.json({"result": req.params.ballotName})
})

router.post('/:ballotName', async function(req, res, next) {

    const ballotName = req.params.ballotName
    const votingToken = req.body.token
    const vote = req.body.vote

    const ballot = await db.findBallotByName(ballotName)
    if (!ballot) {
        return res.render('error', { status: 404, message: "Ballot not found"});
    }

    const isExistingValidToken = ballot.tokens.includes(votingToken)
    const isExistingExpiredToken = ballot.expiredTokens.includes(votingToken)
    const isExistingToken = isExistingValidToken || isExistingExpiredToken

    if (!isExistingToken) {
        return res.render('error', { status: 401, message: 'Token not found'});
    }

    if (isExistingExpiredToken) {
        return res.render('error', { status: 401, message: "Token expired"});
    }

    if (!isValidVote(ballot, vote)) {
        return res.render('error', { status: 400, message: 'Invalid vote'});
    }

    registerVote(ballot, vote)
    expireToken(ballot, votingToken)
    console.log(ballot)
    // save in db
    res.sendStatus(204)
});

function isValidVote(ballot, vote) {
    if (!vote || Object.keys(vote) === 0) {
        return false
    }

    for (let role of Object.keys(vote)) {
        const test = e => e.role === role && e.name === vote[role]
        if (!ballot.candidates.some(test)) {
            return false
        }
    }
    return true
}

function registerVote(ballot, vote) {
    for (let role of Object.keys(vote)) {
        const test = e => e.role === role && e.name === vote[role]
        const foundCandidate = ballot.candidates.find(test)
        // console.log(found)
        if (!foundCandidate) {
            console.error(`Cannot vote for ${vote[role]} as ${role}`);
        }
        foundCandidate.votes += 1
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
