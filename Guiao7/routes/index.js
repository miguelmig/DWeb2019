var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
jsonfile.spaces = 4; // identation
var path = require('path');

public_script_path = path.join(__dirname, '..', 'public', 'javascripts');
var apagar = require(path.join(public_script_path, "apagar.js"))
var editar = require(path.join(public_script_path, "editar.js"))

var MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/filmesDAW"
var content = null;

function loadFilmesFromDB()
{
  return MongoClient.connect(url).then(client => {
    var db = client.db('filmesDAW');
    return db.collection('filmes').find().toArray();
  })
  .catch(err => {
    console.error(err);
    return Promise.reject(err);
  });
}

field_names = {
  "prov":"Província",
  "local":"Local",
  "tit":"Titulo",
  "musico":"Autor",
  "duracao":"Duração",
  "inst": "Instrumentos",
  "file.@t":"Tipo de Ficheiro",
  "file.#text":"Nome do Ficheiro",
  "obs.#text": "Observação(Texto)",
}

title = "Arquivo de Filmes"

function displayErrorPage(res, err)
{
  res.render('error', {message: err.message, error: {status: err.status, stack: err.stack}});
}

function displayPage(res, data)
{
  res.render('index', { title: title , content: data});
}

function getContent()
{
  if(!content)
  {
    var p = loadFilmesFromDB().then(new_content => {
      content = new_content;
      return content;
    });
    return p;
  }

  console.log('Cached result, returning!');
  return new Promise((resolve, reject) => resolve(content));
}

function displayItem(res, content, id)
{
  console.log("Displaying item: " + id);
  var index = content.findIndex(a => a._id == id)
  if(index <= -1)
  {
    console.error("Trying to visualize a filme entry which doesn't exist: " + id);
    displayErrorPage(res, {message: "Invalid film id"});
    return;
  }

  res.render('item', {film: content[index]});
}

function displayEditItem(res, content, id)
{
  console.log("Displaying edit item modal: " + id);
  var index = content.findIndex(a => a._id == id)
  if(index <= -1)
  {
    console.error("Trying to visualize an archive which doesn't exist: " + id);
    res.end(1)
    return;
  }



  res.render('edit-item', {film: content[index]});
}

function displayAddItem(res)
{
  console.log("Displaying add item modal");

  res.render('add-item');
}

function deleteArchive(res, id)
{
  return getContent().then( data => {
    var index = data.findIndex(a => a._id == id)
    if(index <= -1)
    {
      console.error("Trying to delete an archive which doesn't exist: " + id);
      res.end("1");
    }
    let object_id = data[index]['_id'];
    data.splice(index, 1);
    return MongoClient.connect(url).then(client => {
      var db = client.db('filmesDAW');
      return db.collection('filmes').deleteOne({_id: object_id});
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    });
  })
  .catch(err => displayErrorPage(res, err));

}

function addFilm(form_data)
{
  let film_info = form_data;
  for(var key in form_data)
  {
    if(form_data[key])
    {
      console.log("form['" + key+ "'] = " + form_data[key]);
      if(key == 'cast')
      {
        let actor = String(form_data['cast']);
        film_info['cast'] = [];
        film_info['cast'].push(actor);

      }
      else if(key == 'genre')
      {
        film_info['genres'] = [];
        film_info['genres'].push(form_data[key]);
        delete film_info['genre'];
      }
      else
      {
        film_info[key] = form_data[key]
      }
    }
  }

  film_info['year'] = parseFloat(film_info['year']);
  console.dir(film_info);

  return MongoClient.connect(url).then(client => {
    var db = client.db('filmesDAW');
    return db.collection('filmes').insertOne(film_info)
    .then( (obj) => console.log('Added: ' + obj))
    .catch(err => console.error(err));
  })
  .catch(err => {
    console.error(err);
  });

}


function editFilm(content, id, form_data)
{
  var index = content.findIndex(a => a._id == id)
  if(index <= -1)
  {
    console.error("Trying to visualize an archive which doesn't exist: " + id);
    res.end("1");
    return;
  }

  var film_info = content[index];
  for(var key in form_data)
  {
    if(form_data[key])
    {
      console.log("form['" + key+ "'] = " + form_data[key]);
      if(key == 'cast')
      {
        film_info['cast'] = []
        film_info['cast'].push(form_data[key])
      }
      else if(key == 'genre')
      {
        film_info['genres'] = []
        film_info['genres'].push(form_data[key]);
      }
      else
      {
        film_info[key] = form_data[key];
      }
    }
  }
  film_info['year'] = parseFloat(film_info['year']);

  console.dir(film_info);
  MongoClient.connect(url).then(client => {
    var db = client.db('filmesDAW');
    db.collection('filmes').updateOne({_id: film_info['_id']},
      { $set: film_info })
      .then( (obj) => console.log('Updated: ' + obj))
      .catch(err => console.error(err));
  })
  .catch(err => {
    console.error(err);
  });

}

/* GET home page. */
router.get('/', function(req, res, next) 
{
  getContent().then( (content) => {
    displayPage(res, content);
  })
  .catch( err => displayErrorPage(res, err) );
  
});

router.get('/visualize-item/:id/', function (req, res, next)
{
  getContent().then( (content) => {
    displayItem(res, content, req.params.id);
  })
  .catch( err => displayErrorPage(res, err) );
})

router.get('/edit-item/:id/', function (req, res, next)
{
  getContent().then( (content) => {
    displayEditItem(res, content, req.params.id);
  })
  .catch( err => displayErrorPage(res, err) );
})

router.get('/add-item/', function (req, res, next)
{
  displayAddItem(res);
})

router.delete('/:id/', function (req,res,next) {
  var id = req.params.id;
  console.log("deleting: " + id);
  deleteArchive(res, id).then( () => {
    res.end('0');
  })
  .catch(err => console.error(err));
})

router.post('/add/', function (req,res,next) {
  addFilm(req.body).then( () => {
    content = null;
    res.redirect('/');
  });
})

router.put('/edit/:id', function (req, res, next) {
  getContent().then( (content) => {
    editFilm(content, req.params.id, req.body);
    res.end('0');
  })
})

module.exports = router;