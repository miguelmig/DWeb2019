var model = require('../model/nobels')

module.exports.listar = () => {
    return model
           .find({}, {year: 1, category:1})
           .exec();
}

module.exports.consultar = (id) => {
    return model
           .findById(id)
           .exec();
}

module.exports.categorias = () => {
    return model.aggregate([{
        "$group": {_id: "$category"}
    }]).exec();
}

module.exports.listarBy = (params) => {
    var search = {}

    if(params['categoria'])
    {
        search['category'] = params['categoria'];
    }

    if(params['data'])
    {
        search['year'] = {$gt: params['data']};
    }
    
    return model
           .find(search, {year: 1, category:1})
           .exec();
}

module.exports.laureados = () => {
    return model.aggregate([
        {$unwind: "$laureates"},
        {$project: {
            "firstname" : "$laureates.firstname",
            "surname" : "$laureates.surname",
            "year" : 1,
            "category": 1
        }},
        {$sort: {
            "firstname": 1,
            "surname": 1
        }}
    ]).exec();
}