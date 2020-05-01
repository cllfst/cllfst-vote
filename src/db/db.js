'user strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Ballot = require('../ballot/ballot-model')
const env = require('../util/env')

const url = `mongodb://${env.dbHost}:${env.dbPort}/${env.dbName}`
const db = connect()

module.exports = {
    removeBallotByName: async (ballotName) => {
        return Ballot.deleteOne({'ballotName': ballotName})
    },

    newBallot: (ballot) => {
        return new Ballot({
            ballotName: ballot.ballotName,
            startDate: ballot.startDate,
            endDate: ballot.endDate,
            tokens: [],
            candidates: ballot.candidates
        }).save()
    },

    findBallotByName: (ballotName) => {
        return !ballotName ? null : Ballot.findOne({'ballotName': ballotName})
    },

    addTokenToBallot: async (ballotName, token) => {
        const ballot = await Ballot.findOne({ballotName: ballotName})
        ballot.tokens.push(token)
        return ballot.save()
    },

    updateBallot: async (ballot) => {
        return Ballot.findOneAndUpdate({'ballotName': ballot.ballotName}, ballot, {
            useFindAndModify: false,
            new: true
        })
    },

    getOpenBallots: async () => {
        const now = moment().utc()
        // TODO: get only n elements
        return Ballot.find({startDate: {$lte: now}, endDate: {$gte: now}})
    },

    getRecentlyClosedBallots: async () => { // closed during the last week
        const now = moment().utc()
        const lastWeek =  now - 604800000 // 1 week in ms
        // TODO: get only n elements
        return Ballot.find({endDate: {$lte: now, $gte: lastWeek}})
    }

}

function connect() {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    mongoose.connection.once('open', _ => {
        console.log('=> Connected to db')
    })
    mongoose.connection.on('error', err => {
        console.error('=> Db connection error:', err)
    })
    mongoose.connection.on('close', _ => {
        console.error('=> Closed db connection')
    })
    return mongoose.connection
}

function disconnect() {
    db.close()
}
