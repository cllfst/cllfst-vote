var express = require('express');
var router = express.Router();

/*
 *  /!\ CAREFUL: This is just a first minimal prototype
 */

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("Home page !")
});

module.exports = router;
