const mongoose = require('mongoose')
const BallotSchema = require('./ballot')

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME
const url = `mongodb://${dbHost}:${dbPort}/${dbName}`

connect()

function connect() {
    mongoose.connect(url, {
        useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    const db = mongoose.connection
    db.once('open', _ => {
        console.log('Connected to db')
    })
    db.on('error', err => {
        console.error('Db connection error:', err.message())
    })
    db.on('close', _ => {
        console.log('Closed db connection')
    })
}

function disconnect() {
    mongoose.connection.close()
}

async function initNewBallot(name) {
    // connect()
    const ballot = new BallotSchema({
        name: name,
        startDate: Date.now(),
        endDate: Date.now(),
        tokens: [],
        candidates: []
    })
    const saved = await  ballot.save(function (err, document) {
        if (err) {
            console.error(err)
        }
    })

    // disconnect()
    return saved
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
    initNewBallot,
    addTokenToBallot
}



// const CandidateSchema = new CandidateSchema({
//     name: String,
//     responsibility: String,
//     votes: Number
// })