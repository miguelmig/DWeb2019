var express = require('express');
var router = express.Router();
var url = require('url');
var axios = require('axios');

function displayErrorPage(res, message)
{
  res.render('error', {erro:message});
}

router.get('/', function(req,res, next) {
  res.render('index', { title: 'Nobel' });
});

router.get('/premios', function(req, res, next) {
  const query = url.parse(req.url).query;
  console.log(query);
  axios.get('http://localhost:3000/api/premios?' + query)
    .then( resposta => {
      res.render('lista-premios', {premios: resposta.data, title:"Premios"});
    })
    .catch(err => displayErrorPage(res, err));

});

router.get('/premio/:id', function (req, res, next) {
  axios.get('http://localhost:3000/api/premios/' + req.params.id)
    .then( resposta => {
      console.dir(resposta.data);
      res.render('premio', {premio: resposta.data});
    })
    .catch(err => displayErrorPage(res,err));
});

router.get('/categorias', function (req, res, next) {
  axios.get('http://localhost:3000/api/categorias')
    .then( resposta => {
      res.render('lista-categorias', {categorias: resposta.data, title: 'Categorias'})
    })
    .catch(err => displayErrorPage(res, err));
});

router.get('/laureados', function (req, res, next) {
  axios.get('http://localhost:3000/api/laureados')
    .then( resposta => {
        res.render('lista-laureados', {laureados: resposta.data, title: 'Laureados'});
    })
    .catch( err => displayErrorPage(res, err));
});

router.get('/premios-search', function (req, res, next) {
  res.render('pesquisa-premios', {title: "Procurar Prémios"});
})


module.exports = router;

