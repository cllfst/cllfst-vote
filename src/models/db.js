'user strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Ballot = require('./ballot')
const appEnv = require('../util/app-env')

const url = `mongodb://${appEnv.dbHost}:${appEnv.dbPort}/${appEnv.dbName}`
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
        console.log(now)
        // TODO: get only n elements
        return Ballot.find({startDate: {$lte: now}, endDate: {$gte: now}})
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
