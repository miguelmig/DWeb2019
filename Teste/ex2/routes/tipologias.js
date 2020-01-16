const express = require('express');
const router = express.Router();
const axios = require('axios');

const title = "Tipologias";
const {apiKey, apiURL, officialURL} = require('../config/var');


router.get('/', function (req, res,next){
    axios.get(apiURL + 'tipologias?apikey=' + apiKey)
        .then( response => {
            res.render('tipologias-index', {tipologias: response.data, title: title});
        })
        .catch( err => {
            res.render('error', {erro: err, title:"Erro"});
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    axios.all([
        axios.get(apiURL + 'tipologias/' + id + '?apikey=' + apiKey),
        axios.get(apiURL + 'tipologias/' + id + '/elementos?apikey=' + apiKey),
        axios.get(apiURL + 'tipologias/' + id + '/intervencao/dono?apikey=' + apiKey),
        axios.get(apiURL + 'tipologias/' + id + '/intervencao/participante?apikey=' + apiKey)
    ])
    .then(axios.spread( (tipologiaRes, elementosRes, donoRes, participanteRes) => {
        var elementos = elementosRes.data;
        elementos.map((elemento => {
            elemento.link = elemento.id;
            return elemento
        }));
        
        
        var dono = donoRes.data;
        dono.map((processo => {
            processo.link = officialURL + processo.id;
            return processo;
        }))

        var participante = participanteRes.data;
        participante.map((processo => {
            processo.link = officialURL + processo.id;
            return processo;
        }))

        res.render('tipologia', {
            tipologia: tipologiaRes.data,
            elementos: elementos, 
            dono: dono,
            participante: participante,
            title: "Tipologia"
        });
    }))
    .catch(err => {
        res.render('error', {erro: err, title:"Erro"});
    });
})

module.exports = router;