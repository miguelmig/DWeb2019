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

router.get('/tipos', (req, res) => {
    obras.tipos()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/obrasQuant', (req, res) => {
    obras.obrasQuant()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;