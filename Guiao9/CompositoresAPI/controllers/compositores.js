var model = require('../model/compositores')

module.exports.consultar = (id) => {
    return model
           .find({"@id": id})
           .exec();
}

module.exports.listarBy = (params) => {
    var search = {}

    if(params['periodo'])
    {
        search['periodo'] = params['periodo'];
    }

    if(params['ano'])
    {
        search['dataNasc'] = {$lte: params['ano']};
        search['dataObito'] = {$gte: params['ano']};
    }

    return model
           .find(search)
           .exec();
}