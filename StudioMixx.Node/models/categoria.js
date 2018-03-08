var mongoose = require('mongoose');
var schema = mongoose.Schema;
var cat = new schema({
    nome: String,
    status: String
});

module.exports = cat;