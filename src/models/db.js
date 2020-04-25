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

    newBallot: (name, candidates) => {
        return new Ballot({
            name: name,
            startDate: Date.now(),
            endDate: Date.now(),
            tokens: [],
            candidates: candidates
        }).save()
    },

    findBallotByName: (ballotName) => {
        return Ballot.findOne({'name': ballotName})
    },

    addTokenToBallot: async (ballotName, token) => {
        const ballot = await Ballot.findOne({name: ballotName})
        ballot.tokens.push(token)
        return ballot.save()
    },

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

// const CandidateSchema = new CandidateSchema({
//     name: String,
//     responsibility: String,
//     votes: Number
// })