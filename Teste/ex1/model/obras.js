const mongoose = require('mongoose');

var instrumentoSchema = new mongoose.Schema({
    designacao: String,
    partitura: {
        "@type": String,
        "@path": String,
        "@voz": String,
    }
})

var infAdicionalSchema = new mongoose.Schema({
    video: {
        "@href": "String"
    }
})

var obrasSchema = new mongoose.Schema({
    _id: String,
    titulo: String,
    subtitulo: String,
    tipo: String,
    compositor: String,
    arranjo: String,
    editado: String,
    "inf-relacionada": infAdicionalSchema,
    instrumentos: {
        instrumento: [instrumentoSchema]
    }
});

module.exports = mongoose.model('obras', obrasSchema)