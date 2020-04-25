var express = require('express');
var router = express.Router();
const utils = require('../util/utils')
// const appEnv = require('../util/app-env')
const db = require('../models/db')

router.post('/', async function(req, res, next) {

    const votingToken = req.body.token
    const ballotName = req.body.ballot
    const vote = req.body.vote

    if (!ballotName) {
        return res.status(400).json({"error": "Missing ballot name"})
    }

    const ballot = await db.findBallotByName(ballotName)
    if (!ballot) {
        return res.status(404).json({"error": `No ballot with name '${ballotName}'`})
    }

    const isExistingValidToken = ballot.tokens.includes(votingToken)
    const isExistingExpiredToken = ballot.expiredTokens.includes(votingToken)
    const isExistingToken = isExistingValidToken || isExistingExpiredToken

    if (!isExistingToken) {
        return res.sendStatus(401)
    }

    if (isExistingExpiredToken) {
        return res.status(401).json({"error": "Expired voting token"})
    }

    if (!isValidVote(ballot, vote)) {
        return res.status(400).json({"error": "Invalid vote"})
    }

    ballot = registerVote(ballot, vote)
    expireToken(votingToken)
    res.sendStatus(204)
});

function isValidVote(ballot, vote) {
    if (!vote || Object.keys(vote) === 0) {
        return false
    }

    for (const role of Object.keys(vote)) {
        const test = e => e.role === role && e.name === vote.role
        if (!ballot.candidates.some(test)) {
            return false
        }
    }
    return true
}

function registerVote(ballot, vote) {
    const test = e => e.role === role && e.name === vote.role
    const found = ballot.candidates.find(test)
    console.log()
}

module.exports = router;
