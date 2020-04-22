var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
var utils = require('../../util/utils')

/* GET home page. */
router.post('/', function(req, res, next) {
    var senderAddress = req.body.senderAddress
    var senderPassword = req.body.senderPassword
    var emails = req.body.emails

    emails.forEach(email => {
        var votingLink = utils.createVotingLink()
        // TODO: write code to db
        sendEmail(senderAddress, senderPassword, email, votingLink)
    })

    // sendEmails(senderAddress, senderPassword, emails)
    res.json({"result": "true"})
})

function sendEmail(from, fromPassword, to, votingLink) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: from,
            pass: fromPassword
        }
    })

    var mailOptions = {
        from: from,
        to: to,
        subject: "Elections",
        text: 'Please use the following link to vote: ' + votingLink
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = router
