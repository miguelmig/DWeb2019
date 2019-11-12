const express = require('express');
const router = express.Router();

var obras = require('../controllers/obras')

router.get('/obras', (req,res) => {
    obras.listarBy(req.query)
    .then( dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/obras/:id', (req, res) => {
    console.log(req.params.id);
    obras.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/compositores', (req, res) => {
    obras.compositores()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/periodos', (req, res) => {
    obras.periodos()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;