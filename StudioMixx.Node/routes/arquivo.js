var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var _arquivo = require('../models/arquivo');
var arquivo = mongoose.model('arquivo', _arquivo, 'arquivo');
var db = mongoose.connection;
var conn = require("../models/conn");
var Client = require('ftp');
//var https = require('https');
var fs = require('fs');
var multiparty = require('connect-multiparty');
//var PromiseFtp = require('promise-ftp');


var ObjectId = require('mongodb').ObjectID;

//var connectionProperties = {
//    host: 'studiomixx.com.br', user: 'clienteslemo', password: 'o#O$ONnSNE2Qo8'
//};

var connectionProperties = {
    host: 'acaivips.com.br', user: 'matheus@acaivips.com.br', password: '123456789'
};

router.get('/', function (req, res, next) {
    res.end("Arquivo");
});

router.post('/upload', multiparty(), function (req, res, next) {

    //ftp://matheus%40acaivips.com.br:123456789@acaivips.com.br/upload/soundsample.mp3
    //https://msdn.microsoft.com/en-us/library/office/dn769086.aspx
    //connection.js line 106
    //socket.setKeepAlive(false);        

    var temporario = req.files.file.path;
    var arquivoModel = JSON.parse(req.body.modelArquivo);
    var readStream = fs.createReadStream(temporario);

    //array[0] = usuario
    //array[1] = ano
    //array[2] = mes
    //array[3] = categoria
    //array[4] = nomeArquivo

    var c = new Client();
    c.on('ready', function () {
        var array = arquivoModel.caminhoArquivo.split('/');
        array.splice(0, 1);
        c.mkdir('/public_html/painel/upload/' + array[0], false, function (err) {
            c.mkdir('/public_html/painel/upload/' + array[0] + '/' + array[1], false, function (err) {
                c.mkdir('/public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2], false, function (err) {
                    c.mkdir('/public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3], false, function (err) {
                        c.put(temporario, '/public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name, function (err) {
                            if (err) {
                                next(err);
                            } else {
                                conn.abrirConexao('studiomixx', mongoose);
                                db.once('open', function () {

                                    var caminhoCOmpleto = '/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name;
                                    var collection = db.collection('arquivo');
                                    collection.findOne({ caminhoArquivo: caminhoCOmpleto }, function (err, result) {
                                        var arq = arquivo();
                                        arq.idUsuario = new ObjectId(arquivoModel.idUsuario);
                                        arq.idCategoria = new ObjectId(arquivoModel.idCategoria);
                                        arq.caminhoArquivo = '/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name;
                                        arq.mes = arquivoModel.mes;
                                        arq.ano = arquivoModel.ano;
                                        arq.status = 'A';
                                        if (err) {
                                            var err = new Error('Not Found');
                                            err.status = 500;
                                            conn.fecharConexao(mongoose);
                                            next(err);
                                        }
                                        else if (result) {
                                            arq.isNew = false;
                                            arq.save(function (err) {
                                                if (err) {
                                                    c.delete('/public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name, function (err) {
                                                        console.log('Deletou o arquivo /public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name);
                                                    });
                                                    c.end();
                                                    conn.fecharConexao(mongoose);
                                                    next("Erro inserir o arquivo");
                                                }
                                                else {
                                                    conn.fecharConexao(mongoose);
                                                    res.status = 200;
                                                    res.json('OK');
                                                    c.end();
                                                }
                                            });
                                        }
                                        else {
                                            arq.isNew = true;
                                            arq.save(function (err) {
                                                if (err) {
                                                    c.delete('/public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name, function (err) {
                                                        console.log('Deletou o arquivo /public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name);
                                                    });
                                                    c.end();
                                                    conn.fecharConexao(mongoose);
                                                    next("Erro inserir o arquivo");
                                                }
                                                else {
                                                    conn.fecharConexao(mongoose);
                                                    res.status = 200;
                                                    res.json('OK');
                                                    c.end();
                                                }
                                            });
                                        }
                                    });

                                });

                                db.once('error', function () {
                                    c.delete('/public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name, function (err) {
                                        console.log('Deletou o arquivo /public_html/painel/upload/' + array[0] + '/' + array[1] + '/' + array[2] + '/' + array[3] + '/' + req.files.file.name);
                                    });
                                    c.end();
                                    conn.fecharConexao(mongoose);
                                    next("Erro ao conectar no banco de dados");
                                });
                            }
                        });

                    });
                });
            });
        });

    });

    c.on('error', function (err) {
        next(err);
    });

    c.connect(connectionProperties);
});

router.get('/listarArquivosPorUsuario', function (req, res, next) {

    conn.abrirConexao('studiomixx', mongoose, function (err) {
        console.log(err);
    });

    db.once('open', function () {
        var collection = db.collection('arquivo');
        var query = {};
        if (req.query.mes != '')
            query.mes = req.query.mes;

        if (req.query.idCategoria != '')
            query.idCategoria = new ObjectId(req.query.idCategoria);

        query.idUsuario = new ObjectId(req.query.idUsuario)
        query.ano = req.query.ano;
        collection.aggregate([
            {
                $lookup:
                {
                    from: "usuario",
                    localField: "idUsuario",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            {
                $lookup:
                {
                    from: "categoria",
                    localField: "idCategoria",
                    foreignField: "_id",
                    as: "categoria"
                }
            },
            {
                $match: query
            }
        ]).toArray(function (err, result) {
            if (err) {
                var err = new Error('Not Found');
                err.status = 500;
                conn.fecharConexao(mongoose);
                next(err);
            }
            else {
                conn.fecharConexao(mongoose);
                res.end(JSON.stringify(result));

            }
        });


        //collection.find({ idUsuario: new ObjectId(req.query.idUsuario) }).toArray(function (err, result) {
        //    if (err) {
        //        var err = new Error('Not Found');
        //        err.status = 500;
        //        conn.fecharConexao(mongoose);
        //        next(err);
        //    }
        //    else {
        //        conn.fecharConexao(mongoose);
        //        res.end(JSON.stringify(result));

        //    }
        //});
    });

    db.once('error', function (error) {
        conn.fecharConexao(mongoose, function () {
        });

        var err = new Error(error);
        err.status = 500;
        next(err);
    });

});

router.get('/listarTodosAtivos', function (req, res, next) {

    conn.abrirConexao('studiomixx', mongoose, function (err) {
        console.log(err);
    });

    db.once('open', function () {
        var collection = db.collection('arquivo');

        collection.aggregate([
            {
                $lookup:
                {
                    from: "usuario",
                    localField: "idUsuario",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            {
                $lookup:
                {
                    from: "categoria",
                    localField: "idCategoria",
                    foreignField: "_id",
                    as: "categoria"
                }
            },
            {
                $match: { 'status': 'A' }
            }
        ]).toArray(function (err, result) {
            if (err) {
                var err = new Error('Not Found');
                err.status = 500;
                conn.fecharConexao(mongoose);
                next(err);
            } else {
                res.end(JSON.stringify(result));
                conn.fecharConexao(mongoose);
            }

        });

    });

    db.once('error', function (error) {
        conn.fecharConexao(mongoose, function () {
        });

        var err = new Error(error);
        err.status = 500;
        next(err);
    });

});

router.post('/deletarArquivo', function (req, res, next) {

    var c = new Client();

    c.on('ready', function () {
        c.delete('/public_html/painel' + req.body.caminhoArquivo, function (err) {
            if (err) {
                next(err);
            }
            else {
                conn.abrirConexao('studiomixx', mongoose, function (err) {
                    next(err);
                });

                db.once('open', function () {
                    var collection = db.collection('arquivo');
                    collection.findOneAndDelete({ 'caminhoArquivo': req.body.caminhoArquivo }, function (err) {
                        if (err) {
                            next(err);
                        }
                        else {
                            conn.fecharConexao(mongoose);
                            c.end();
                            res.status = 200;
                            res.end('OK');
                        }

                    });

                });

                db.once('error', function (error) {
                    conn.fecharConexao(mongoose, function () {
                    });
                    c.end();
                    var err = new Error(error);
                    err.status = 500;
                    next(err);
                    conn.fecharConexao(mongoose);
                });
            }
        });

        c.on('error', function (err) {
            next(err);
        });
    });

    c.connect(connectionProperties);

});


module.exports = router;