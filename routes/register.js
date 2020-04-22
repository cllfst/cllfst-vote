var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"; // the default url
require('dotenv').config();



/* GET home page. */
router.get('/', function (req, res, next) {
    sendEmails()
    res.sendFile(path.resolve("../cllfst_vote/public/register.html"));
});
router.post('/', function (req, res, next) {    
    MongoClient.connect(url, async function (err, db) {
        console.log("connected");
        if (err) throw err;
        else {
            var dbo = db.db("votes");
            dbo.collection("IDs").findOne({ identity: req.body.ID }, function (err, result) {
                if (err) console.log(err);
                else {
                    if(result){
                        res.sendFile(path.resolve("../cllfst_vote/public/vote.html"));
                    }
                    else res.sendFile(path.resolve("../cllfst_vote/public/erreur.html"));
                }
            });
        }
        db.close();
    })
    console.log(globalString);

    
});

function sendEmails() {
    var randomstring = require("randomstring");
    var from = process.env.EMAIL
    var emails = ["a@b.c", "ab@bc.cd"] // TODO: read email list here
    emails.forEach(email => {
        var randomAccessCode = randomstring.generate(64);
        // TODO: write code to db
        global.globalString = randomAccessCode;
        MongoClient.connect(url, async function (err, db) {
            console.log("connected");
            if (err) throw err;
            else {
                var dbo = db.db("votes");
                dbo.collection("IDs").insertOne({ identity: randomAccessCode }, function (err, result) {
                    if (err) console.log(err);
                    else {
                        console.log('id added');
                    }
                });
            }
            db.close();
        })


        sendEmail(from, email, randomAccessCode)
    });
}

function sendEmail(from, to, accessCode) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "XAuth2",
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

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;