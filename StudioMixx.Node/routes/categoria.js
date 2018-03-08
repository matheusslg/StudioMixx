var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _categoria = require('../models/categoria');
var categoria = mongoose.model('categoria', _categoria, 'categoria');
var db = mongoose.connection;
var conn = require("../models/conn");
var ObjectId = require('mongoose').Types.ObjectId;

router.get('/', function (req, res, next) {
    res.end("Categoria");
});

router.get('/cadastrar', function (req, res, next) {
    conn.abrirConexao('studiomixx', mongoose);
    db.once('open', function () {
        var cat = categoria();
        cat.nome = req.query.nome;
        cat.status = req.query.status;
        cat.isNew = true;
        cat.save(function (err) {
            if (err) {
                conn.fecharConexao(mongoose);
                res.status(500);
                res.end("Erro inserir a categoria");
            }
            else {
                conn.fecharConexao(mongoose);
                res.status = 200;
                res.end('OK');
            }
        });

    });

    db.once('error', function () {
        conn.fecharConexao(mongoose);
        res.status(500);
        res.end("Erro ao conectar no banco de dados");
    });
});

router.get('/modificar', function (req, res, next) {
    conn.abrirConexao('studiomixx', mongoose);
    db.once('open', function () {
        var cat = categoria();
        cat._id = req.query.id;
        cat.nome = req.query.nome;
        if (req.query.status)
            cat.status = req.query.status;
        cat.isNew = false;
        cat.save(function (err) {
            if (err) {
                conn.fecharConexao(mongoose);
                res.status(500);
                res.end("Erro ao atualizar a categoria");
            }
            else {
                conn.fecharConexao(mongoose);
                res.status = 200;
                res.end('OK');
            }
        });
    });

    db.once('error', function () {
        conn.fecharConexao(mongoose);
        res.status(500);
        res.end("Erro ao conectar no banco de dados");
    });
});

router.get('/listartodos', function (req, res, next) {

    conn.abrirConexao('studiomixx', mongoose, function (err) {
        console.log(err);
    });

    db.once('open', function () {
        var collection = db.collection('categoria');
        collection.find().toArray(function (err, result) {
            if (err) {
                var err = new Error('Not Found');
                err.status = 500;
                conn.fecharConexao(mongoose);
                next(err);
            }
            else {
                res.end(JSON.stringify(result));
                conn.fecharConexao(mongoose);
            }
        });
    });

    db.once('error', function (error) {        
        conn.fecharConexao(mongoose, function () {
        });
    });

});

router.get('/listartodosativos', function (req, res, next) {

    conn.abrirConexao('studiomixx', mongoose, function (err) {
        console.log(err);
    });

    db.once('open', function () {
        var collection = db.collection('categoria');
        collection.find({ 'status': 'A' }).toArray(function (err, result) {
            if (err) {
                var err = new Error('Not Found');
                err.status = 500;
                conn.fecharConexao(mongoose);
                next(err);
            }
            else {
                res.end(JSON.stringify(result));
                conn.fecharConexao(mongoose);
            }
        });
    });

    db.once('error', function (error) {        
        var err = new Error(error);
        err.status = 500;
        conn.fecharConexao(mongoose, function () {
        });
        next(err);

    });

});

router.get('/obterPorId', function (req, res, next) {

    conn.abrirConexao('studiomixx', mongoose, function (err) {
        console.log(err);
    });

    db.once('open', function () {
        var collection = db.collection('categoria');        
        collection.findOne({ '_id': new ObjectId(req.query.id) },function (err, result) {
            if (err) {
                var err = new Error('Not Found');
                err.status = 500;
                conn.fecharConexao(mongoose);
                next(err);
            }
            else {
                res.end(JSON.stringify(result));
                conn.fecharConexao(mongoose);
            }
        });
    });

    db.once('error', function (error) {
        var err = new Error(error);
        err.status = 500;
        conn.fecharConexao(mongoose, function () {
        });
        next(err);

    });

});



module.exports = router;
