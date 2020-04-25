'user strict'

const mongoose = require('mongoose')
const BallotSchema = require('./ballot')

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME
const url = `mongodb://${dbHost}:${dbPort}/${dbName}`

connect()

async function connect() {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    const db = mongoose.connection
    db.once('open', _ => {
        console.log('Connected to db')
    })
    db.on('error', err => {
        console.error('Db connection error:', err)
    })
    db.on('close', _ => {
        console.log('Closed db connection')
    })
}

async function disconnect() {
    await mongoose.connection.close()
}

async function newBallot(name, candidates) {
    // connect()
    const ballot = new BallotSchema({
        name: name,
        startDate: Date.now(),
        endDate: Date.now(),
        tokens: [],
        candidates: candidates
    })
    const saved = await ballot.save()
    // console.log(saved)
    // console.log('saved')
    // disconnect()
    return saved
}

async function removeBallotByName(name) {
    return await BallotSchema.deleteOne({'name': name})
    // console.log('removed ballot');
}

async function addTokenToBallot(ballotName, token) {
    // connect()
    const ballot = await BallotSchema.findOne({
        name: ballotName
    })

    ballot.tokens.push(token)
    const saved = await ballot.save()
    // disconnect()
    return saved
}

module.exports = {
    newBallot,
    removeBallotByName,
    addTokenToBallot
}



// const CandidateSchema = new CandidateSchema({
//     name: String,
//     responsibility: String,
//     votes: Number
// })