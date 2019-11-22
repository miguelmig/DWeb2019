const ficheiro = require('../models/ficheiros')

module.exports.listar = () => {
    return ficheiro
            .find()
            .exec();
}

module.exports.apagar = (id) => {
    return ficheiro
            .findOneAndRemove({_id: id})
            .exec();
}