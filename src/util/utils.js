'use strict'

var nodemailer = require('nodemailer')
var randomstring = require("randomstring")


function createVotingLink() {
    var accessToken = randomstring.generate(64);
    return process.env.DOMAIN_NAME + '/' + accessToken
    
}

function sendEmail(email) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email.from,
            pass: email.password
        }
    })

    var mailOptions = {
        from: email.from,
        to: email.to,
        subject: email.subject,
        text: email.body
    }

    console.log(`Sending email [to:${email.to}]`)
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(`Error sending email [to:${email.to}, error:${err.message}]`)
            // console.log(err)
        } else {
            console.log(`Email sent [to:${email.to}, response:${info.response}]`)
        }
    })
}

module.exports = {
    createVotingLink,
    sendEmail
}