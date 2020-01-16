var model = require('../model/obras')

module.exports.consultar = (id) => {
    return model
           .find({"_id": id})
           .exec();
}

module.exports.listarBy = (params) => {
    var search = {}

    if(params['compositor'])
    {
        search['compositor'] = params['compositor'];
    }
    else if(params['instrumento'])
    {
        search['instrumentos.instrumento.designacao'] = params['instrumento'];
    }

    return model
           .find(search)
           .exec();
}

module.exports.tipos = () => {
    return model.aggregate([
        {$group: {_id: "$tipo"}},
        {$match: {
            $expr: {
                $ne: [ "$_id", null ]
            }
        }}
    ]).exec();

}

module.exports.obrasQuant = () => {
    return model.aggregate([
        {
            $project: {
                titulo: 1,
                partituras: { "$size": "$instrumentos.instrumento" } 
            }
    }
    ]).exec();
}

