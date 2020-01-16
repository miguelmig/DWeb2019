const express = require('express');
const router = express.Router();
const axios = require('axios');


const title = "Entidades Públicas";
const {apiKey, apiURL, officialURL} = require('../config/var');

router.get('/', function (req, res,next){
    axios.get(apiURL + 'entidades/?apikey=' + apiKey)
        .then( response => {
            res.render('index', {entities: response.data, title: title});
        })
        .catch( err => {
            res.render('error', {erro: err, title:"Erro"});
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    axios.all([
        axios.get(apiURL + 'entidades/' + id + '?apikey=' + apiKey),
        axios.get(apiURL + 'entidades/' + id + '/tipologias?apikey=' + apiKey),
        axios.get(apiURL + 'entidades/' + id + '/intervencao/dono?apikey=' + apiKey),
        axios.get(apiURL + 'entidades/' + id + '/intervencao/participante?apikey=' + apiKey)
    ])
    .then(axios.spread( (entidadeRes, tipologiaRes, donoRes, participanteRes) => {
        var tipologias = tipologiaRes.data;
        tipologias.map((tipologia => {
            //tipologia.link = apiURL + 'tipologias/' + tipologia.id + '?apikey=' + apiKey;
            tipologia.link = '/tipologias/' + tipologia.id;
            return tipologia
        }));
        var entidade = entidadeRes.data;
        entidade.link = apiURL + 'entidades/' + id + '?apikey=' + apiKey;

        var dono = donoRes.data;
        dono.map((processo => {
            processo.link = officialURL + 'c' + processo.codigo;
            return processo;
        }))

        var participante = participanteRes.data;
        participante.map((processo => {
            processo.link = officialURL + 'c' + processo.codigo;
            return processo;
        }))

        res.render('entidade', {
            entidade: entidade,
            tipologias: tipologias, 
            dono: dono,
            participante: participante,
            title: "Entidade"
        });
    }))
    .catch(err => {
        res.render('error', {erro: err, title:"Erro"});
    });
})

module.exports = router;