var express = require('express');
var router = express.Router();
var axios = require('axios');


const lhost = require('../config/env').host
/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get(lhost + "/api/ficheiros")
  .then( response => {
    res.render('index', {lista: response.data});
  })
  .catch( err => {
    res.render('error', {error: err});
  })
});

router.get('/download/:fnome', function(req,res,next) {
  res.download(__dirname + "/../public/ficheiros" + req.params.fnome);
})

module.exports = router;
