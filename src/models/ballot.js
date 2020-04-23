const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CandidateSchema = new Schema({
    name: String,
    responsibility: String,
    votes: Number
})

const BallotSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    tokens: Array,
    candidates: [CandidateSchema]
})

module.exports = mongoose.model('ballot', BallotSchema)
