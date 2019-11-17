var express = require('express');
var router = express.Router();
var compositores = require('../controllers/compositores')


title = 'Compositores'

router.get('/compositores/:id', function(req, res, next) {
  var id = req.params.id;
  console.log("Consultando compositor com id: " + id);
  compositores.consultar(id).then(data => {
    res.jsonp(data);
  })
  .catch(err => res.status(500).jsonp(err))
})

router.get('/compositores', function(req, res, next) {
  compositores.listarBy(req.query)
  .then(data => res.jsonp(data))
  .catch(err => res.status(500).jsonp(err))
});

module.exports = router;
