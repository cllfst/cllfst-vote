'use strict'

var randomstring = require("randomstring")


function createVotingLink() {
    var accessToken = randomstring.generate(64);
    return process.env.DOMAIN_NAME + accessToken
    
}

module.exports = {
    createVotingLink
}