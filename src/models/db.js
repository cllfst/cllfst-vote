'user strict'

const mongoose = require('mongoose')
const Ballot = require('./ballot')
const appEnv = require('../util/app-env')

const url = `mongodb://${appEnv.dbHost}:${appEnv.dbPort}/${appEnv.dbName}`
const db = connect()

module.exports = {
    removeBallotByName: async (name) => {
        return Ballot.deleteOne({'name': name})
    },

    newBallot: (ballot) => {
        return new Ballot({
            name: ballot.ballotName,
            startDate: ballot.startDate,
            endDate: ballot.endDate,
            tokens: [],
            candidates: ballot.candidates
        }).save()
    },

    findBallotByName: (ballotName) => {
        return !ballotName ? null : Ballot.findOne({'name': ballotName})
    },

    addTokenToBallot: async (ballotName, token) => {
        const ballot = await Ballot.findOne({name: ballotName})
        ballot.tokens.push(token)
        return ballot.save()
    },

    updateBallot: async (ballot) => {
        return Ballot.findOneAndUpdate({'name': ballot.ballotName}, ballot, {
            useFindAndModify: false,
            new: true
        })
        // return Ballot.findOne({'name': ballot.ballotName})
    }

}

function connect() {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    mongoose.connection.once('open', _ => {
        console.log('Connected to db')
    })
    mongoose.connection.on('error', err => {
        console.error('Db connection error:', err)
    })
    mongoose.connection.on('close', _ => {
        console.log('Closed db connection')
    })
    return mongoose.connection
}

function disconnect() {
    db.close()
}
