var mongoose = require('mongoose');
var schema = mongoose.Schema;
var user = new schema({
    login: String,
    senha: String,
    adm: Boolean,
    status: String
});

module.exports = user;