var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    sg: String,
    interne: String,
    externe: String,
    cm: String,
    media: String,
    sponsoring: String,
    materiel: String

});

module.exports = mongoose.model('votes', userSchema);