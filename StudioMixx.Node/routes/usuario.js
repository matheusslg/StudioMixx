var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _usuario = require('../models/usuario');
var usuario = mongoose.model('usuario', _usuario, 'usuario');
var db = mongoose.connection;
var conn = require("../models/conn");
var ObjectId = require('mongoose').Types.ObjectId;

router.get('/', function (req, res, next) {
    res.end("Usuario");
});

router.get('/cadastrar', function (req, res, next) {
    conn.abrirConexao('studiomixx', mongoose);
    db.once('open', function () {
        var user = usuario();
        user.login = req.query.login;
        user.senha = req.query.senha;
        user.adm = req.query.adm;
        if (req.query.status)
            user.status = req.query.status;
        user.isNew = true;
        user.save(function (err) {
            if (err) {
                conn.fecharConexao(mongoose);
                res.status(500);
                res.end("Erro ao inserir o usuario");
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
        var user = usuario();
        user._id = req.query.id;
        user.login = req.query.login;
        user.senha = req.query.senha;
        user.adm = req.query.adm;
        if (req.query.status)
            user.status = req.query.status;
        user.isNew = false;
        user.save(function (err) {
            if (err)
            {
                conn.fecharConexao(mongoose);
                res.status(500);
                res.end("Erro ao atualizar o usuario");}
            else
            {
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
        var collection = db.collection('usuario');
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
        var collection = db.collection('usuario');
        collection.find({'status' : 'A'}).toArray(function (err, result) {
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

router.get('/obterPorId', function (req, res, next) {

    conn.abrirConexao('studiomixx', mongoose, function (err) {
        console.log(err);
    });

    db.once('open', function () {
        var collection = db.collection('usuario');
        console.log(req.query.id);
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
        conn.fecharConexao(mongoose, function () {
        });
        var err = new Error(error);
        err.status = 500;
        next(err);
    });

});

router.get('/login', function (req, res, next) {

    conn.abrirConexao('studiomixx', mongoose, function (err) {
        console.log(err);
    });

    db.once('open', function (usuario,senha) {
        var collection = db.collection('usuario');
        collection.findOne({ 'login': req.query.login,'senha':req.query.senha,'status':'A'},function (err, result) {
            if (err) {
                var err = new Error('Not Found');
                err.status = 500;
                conn.fecharConexao(mongoose);
                next(err);
            }
            else {
                result.senha = "";
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


module.exports = router;
