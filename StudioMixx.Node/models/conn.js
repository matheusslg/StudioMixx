var abrirConexao = function (banco, mongoose) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/' + banco);
};

var fecharConexao = function (mongoose) {
    db = mongoose.connection;
    db.close();
}

module.exports = {
    abrirConexao: abrirConexao,
    fecharConexao: fecharConexao
}