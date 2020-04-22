var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Vote = require('../models/votes');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
require('dotenv');

/*
 *  /!\ CAREFUL: This is just a first minimal prototype
 */

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.resolve("../cllfst_vote/public/vote.html"));
});

router.post('/', function (req, res) {

    console.log(globalString);
    const vote = new Vote({
        sg: req.body.sg,
        interne: req.body.interne,
        externe: req.body.externe,
        cm: req.body.cm,
        media: req.body.media,
        sponsoring: req.body.sponsoring,
        materiel: req.body.materiel
    });
    console.log(globalString);
    
    MongoClient.connect(url, async function (err, db) {
        var dbo = db.db("votes");
        dbo.collection("IDs").findOne({ identity: globalString }, function (err, obj) {
        if (obj) {console.log('okey');}
        else { res.sendFile(path.resolve('../cllfst_vote/public/erreur.html')); 
        }
        })
        dbo.collection("IDs").deleteOne({ identity: globalString }, function (err, obj) {
              console.log('ID deleted');
        });
        dbo.collection("voters").insertOne(vote, function (err, result) {
            if (err) res.sendFile(path.resolve('../cllfst_vote/public/erreur.html'));
            else {
                res.sendFile(path.resolve('../cllfst_vote/public/done.html'));
            }
        });
        db.close(); 
    });
    

});


module.exports = router;