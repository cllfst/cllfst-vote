'use strict'

var nodemailer = require('nodemailer')
var randomstring = require("randomstring")


function generateRandomString(length) {
    if (!length) {
        length = 64
    }
    return randomstring.generate(length);
}

function createVotingLink() {
    var accessToken = generateRandomString();
    return process.env.DOMAIN_NAME + '/' + accessToken   
}

function sendEmail(to, subject, body) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER,
            pass: process.env.PASSWORD
        }
    })

    var mailOptions = {
        from: process.env.SENDER,
        to: to,
        subject: subject,
        text: body
    }

    console.log(`Sending email [to:${to}]`)
    // transporter.sendMail(mailOptions, function(err, info) {
    //     if (err) {
    //         console.log(`Error sending email [to:${to}, error:${err.message}]`)
    //         // console.log(err)
    //     } else {
    //         // console.log(`Email sent [to:${to}, response:${info.response}]`)
    //     }
    // })
}

function isEmpty(object) {
    return JSON.stringify(object) == JSON.stringify({})
}

module.exports = {
    generateRandomString,
    createVotingLink,
    sendEmail,
    isEmpty
}