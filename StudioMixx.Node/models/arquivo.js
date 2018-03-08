var mongoose = require('mongoose');
var schema = mongoose.Schema;

var arq = new schema({
    idUsuario: mongoose.Schema.Types.ObjectId,
    idCategoria: mongoose.Schema.Types.ObjectId,
    caminhoArquivo: String,
    ano: String,
    mes: String,
    nomeUsuario: String,
    nomeCategoria: String,
    status: String
});

module.exports = arq;