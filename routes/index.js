var express = require('express');
var router = express.Router();

/*
 *  /!\ CAREFUL: This is just a first minimal prototype
 */

/* GET home page. */
router.get('/', function(req, res, next) {
    sendEmails()
    res.send("Please check you email inbox !")
});

function sendEmails() {
    var randomstring = require("randomstring");
    var cllfstAddress = 'cllfst.vote@gmail.com'
    var emails = ["a@b.com", "a@b.c"] // TODO: read email list here
    emails.forEach(email => {
        var randomAccessCode = randomstring.generate(64);
        sendEmail(cllfstAddress, email, randomAccessCode)
    });
}

function sendEmail(from, to, accessCode) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: from,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: from,
        to: to,
        subject: 'Voting second test',
        text: 'Your code is: ' + accessCode
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;
