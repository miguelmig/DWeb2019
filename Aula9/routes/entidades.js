const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzM0ODgwMDgsImV4cCI6MTU3NjA4MDAwOH0.UD0UdMrzKcWDop8HlwqdeOuK_ZzZxHvOMOP2DMkIjUQ";
const title = "Entidades Públicas";
router.get('/', function (req, res,next){
    axios.get('http://clav-api.dglab.gov.pt/api/entidades/?apikey=' + apiKey)
        .then( response => {
            res.render('index', {entities: response.data, title: title});
        })
        .catch( err => {
            res.render('error', {erro: err});
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    axios.all([
        axios.get('http://clav-api.dglab.gov.pt/api/entidades/' + id + '/tipologias?apikey=' + apiKey),
        axios.get('http://clav-api.dglab.gov.pt/api/entidades/' + id + '/intervencao/dono?apikey=' + apiKey),
        axios.get('http://clav-api.dglab.gov.pt/api/entidades/' + id + '/intervencao/participante?apikey=' + apiKey)
    ])
    .then(axios.spread( (tipologiaRes, donoRes, participanteRes) => {
        res.render('entidade', {
            tipologias: tipologiaRes.data, 
            dono: donoRes.data,
            participante: participanteRes.data,
            title: "Entidade"
        });
    }))
    .catch(err => {
        res.render('error', {erro: err});
    });

})

module.exports = router;