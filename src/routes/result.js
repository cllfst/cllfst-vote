var express = require('express');
var router = express.Router();
const db = require('../models/db');
const utils = require('../util/utils')

/* GET Result page. */
router.get('/:ballotName',async function(req, res, next) {
    const ballotName = req.params.ballotName
    console.log(ballotName)
    const ballot = await db.findBallotByName(ballotName)
    console.log(ballot)
    if(ballot.endDate > new Date()){
        return res.render('error',{status:400,message:'Please revisit us after the end of the vote on '+ballot.endDate})
    }
    if(!ballot){
         // return html page instead
         return res.render('error', {status: 400, message: 'No ballot found!'})
    }

    const candidatesPerRolePerVote = getCondidatesPerRolePerVote(ballot)
   
    res.render('result',{roles: utils.roles, candidatesPerRolePerVote: candidatesPerRolePerVote})
});
function getCondidatesPerRolePerVote(ballot){
    const candidatesPerRolePerVote = {}
    for (const role of utils.roles){
        candidatesPerRolePerVote[role]=[]
    }
    for (const candidate of ballot.candidates){
        candidatesPerRolePerVote[candidate.role].push(new Object({nom:candidate.name,vote:candidate.votes}))
    }
    return candidatesPerRolePerVote;
}

module.exports = router;