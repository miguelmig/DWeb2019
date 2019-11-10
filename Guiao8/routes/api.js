const express = require('express');
const router = express.Router();

var nobels = require('../controllers/nobels')

router.get('/premios', (req,res) => {
    nobels.listarBy(req.query)
    .then( dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/premios/:id', (req, res) => {
    console.log(req.params.id);
    nobels.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/categorias', (req, res) => {
    nobels.categorias()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

router.get('/laureados', (req, res) => {
    nobels.laureados()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});
module.exports = router;