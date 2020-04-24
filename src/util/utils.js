'use strict'

var nodemailer = require('nodemailer')
var randomstring = require("randomstring")


function generateRandomString(length) {
    if (!length) {
        length = 64
    }
    return randomstring.generate(length);
}

function sendEmail(senderEmail, senderPassword, to, subject, body) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: senderPassword
        }
    })

    var mailOptions = {
        from: senderEmail,
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

// function isEmpty(object) {
//     return JSON.stringify(object) == JSON.stringify({})
// }

module.exports = {
    generateRandomString,
    sendEmail,
    // isEmpty
}