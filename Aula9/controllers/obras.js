var model = require('../model/obras')

module.exports.consultar = (id) => {
    return model
           .find({"@id": id})
           .exec();
}

module.exports.listarBy = (params) => {
    var search = {}

    if(params['ano'])
    {
        search['anoCriacao'] = params['ano'];
    }
    else if(params['periodo'])
    {
        search['periodo'] = params['periodo'];
    }
    else if(params['compositor'] && params['duracao'])
    {
        search['$and'] = [
            {"compositor": params['compositor']},
            {"duracao": {$gte: params['duracao']}}
        ];
    }
    
    return model
           .find(search)
           .exec();
}

module.exports.compositores = () => {
    return model.aggregate([
        {$group: {_id: "$compositor"}}
    ]).exec();

}

module.exports.periodos = () => {
    return model.aggregate([
        {$group: {_id: "$periodo"}}
    ]).exec();
}

