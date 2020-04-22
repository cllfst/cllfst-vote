var express = require('express')
var router = express.Router()
var utils = require('../../util/utils')

/* GET home page. */
router.post('/', function(req, res, next) {
    var email = {
        sender: req.body.sender,
        password: req.body.password,
        // to: "",
        subject: "Elections",
        // body: ""
    }

    console.log(`Initializing ballot [requester:${req.body.sender}]`)
    req.body.emails.forEach(to => {
        email.to = to
        var votingLink = utils.createVotingLink()
        email.body = 'Please use the following link to vote: ' + votingLink
        // TODO: write code to db
        console.log(`email: ${JSON.stringify(email)}`)
        utils.sendEmail(email)
    })

    res.json({"result": "true"})
})

module.exports = router
