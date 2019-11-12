const mongoose = require('mongoose');

var obrasSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    "@id": String,
    nome: String,
    desc: String,
    anoCriacao: String,
    periodo: String,
    compositor: String,
    duracao: String
});

module.exports = mongoose.model('obras', obrasSchema)