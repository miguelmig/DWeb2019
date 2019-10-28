var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
jsonfile.spaces = 4; // identation
var path = require('path');

public_script_path = path.join(__dirname, '..', 'public', 'javascripts');
var apagar = require(path.join(public_script_path, "apagar.js"))
var editar = require(path.join(public_script_path, "editar.js"))

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

title = "Arquivo Sonoro"

database = path.join(__dirname, '..', 'arq-son-EVO.json');

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
  return jsonfile.readFile(database);
}

function displayItem(res, content, id)
{
  console.log("Displaying item: " + id);
  arq_lists = content['arq']['doc']
  var index = arq_lists.findIndex(a => a.id == id)
  if(index <= -1)
  {
    console.error("Trying to visualize an archive which doesn't exist: " + id);
    res.end(1)
    return;
  }

  let song_info = arq_lists[index];
  delete song_info['id'];

  for(var key in song_info)
  {
    if(typeof(song_info[key]) === 'object')
    {
      // flat objects to be displayed
      for(var key2 in song_info[key])
      {
          // third loop is as deep as we need to go
          if(typeof(song_info[key][key2]) === 'object')
          {
            for(var key3 in song_info[key][key2])
            {
              song_info[key + '.' + key2 + '.' + key3] = song_info[key][key2][key3];
            }
            delete song_info[key][key2];
          }
        song_info[key + '.' + key2] = song_info[key][key2];
        field_names
      }
      delete song_info[key];
    }
  }

  let song_info_pretty = {};
  for(var key in song_info)
  {
    var translated = field_names[key];
    if(translated)
    {
      song_info_pretty[translated] = song_info[key];
    }
  }
  res.render('item', {content: arq_lists, song: song_info_pretty});
}

function displayEditItem(res, content, id)
{
  console.log("Displaying edit item modal: " + id);
  arq_lists = content['arq']['doc']
  var index = arq_lists.findIndex(a => a.id == id)
  if(index <= -1)
  {
    console.error("Trying to visualize an archive which doesn't exist: " + id);
    res.end(1)
    return;
  }

  let song_info = arq_lists[index];
  if(!song_info['obs'])
  {
    song_info['obs'] = {'#text' : ""};
  }
  else if(!song_info['obs']['#text'])
  {
    song_info['obs']['#text'] = "";
  }

  if(!song_info['file'])
  {
    song_info['file'] = {'#text' : "", '@t': ""};
  }

  if(!song_info['file']['#text'])
  {
    song_info['file']['#text'] = "";
  }

  if(!song_info['file']['@t'])
  {
    song_info['file']['@t'] = "";
  }

  if(!song_info['inst'])
  {
    song_info['inst'] = "";
  }

  if(!song_info['duracao'])
  {
    song_info['duracao'] = "";
  }

  if(!song_info['musico'])
  {
    song_info['musico'] = "";
  }


  res.render('edit-item', {content: arq_lists, song: song_info});
}

function displayAddItem(res, content)
{
  console.log("Displaying add item modal");
  arq_lists = content['arq']['doc'];

  res.render('add-item', {content: arq_lists});
}

function deleteArchive(res, id)
{
  return getContent().then( data => {
    arq_lists = data['arq']['doc']
    var index = arq_lists.findIndex(a => a.id == id)
    if(index <= -1)
    {
      console.error("Trying to delete an archive which doesn't exist: " + id);
      res.end(1);
      return Promise.reject("No such archive");
    }

    arq_lists.splice(index, 1);
    
    jsonfile.writeFile(database, data, err => {
      if(err)
      {
        console.error(err);
        res.end(1);
        return Promise.reject("Unable to write to file");
      }
      console.log('Archive removed sucessfully');
      return data; // for chaining
    }).then(Promise.resolve(data));
  })
  .catch(err => displayErrorPage(res, err));

}

function addMusic(content, form_data)
{
  let song_info = form_data;
  if(song_info['obs'])
  {
    song_info['obs'] = { "#text" : song_info[obs] };
  }

  if(song_info['file_type'])
  {
    song_info['file'] = { "@t" : song_info['file_type']}
    delete song_info['file_type'];
  }

  if(song_info['file_name'])
  {
    if(song_info['file'])
      song_info['file']['#text'] = song_info['file_name'];
    else
      song_info['file'] = {"#text": song_info['file_name']};
    
    delete song_info['file_name'];
  }

  let max_id = 0;
  arq_lists = content['arq']['doc'];
  arq_lists.forEach( song => {
    if(song.id > max_id)
      max_id = song.id;
  });

  song_info['id'] = max_id + 1;
  arq_lists.push(song_info);
  jsonfile.writeFile(database, content, err => {
    if(err)
    {
      console.error(err);
      res.end(1);
      return Promise.reject("Unable to write to file");
    }
    console.log('Archive added sucessfully');
  })
}


function editMusic(content, id, form_data)
{
  arq_lists = content['arq']['doc']
  var index = arq_lists.findIndex(a => a.id == id)
  if(index <= -1)
  {
    console.error("Trying to visualize an archive which doesn't exist: " + id);
    res.end(1)
    return;
  }

  var song_info = arq_lists[index];
  for(var key in form_data)
  {
    if(form_data[key])
    {
      console.log("form['" + key+ "'] = " + form_data[key]);
      if(key == 'obs')
      {
        if(song_info['obs'])
        {
          song_info['obs']['#text'] = form_data['obs'];
        }
        else
        {
          song_info['obs'] = { "#text" : form_data['obs'] };
        }
      }
      else if(key == 'file_type')
      {
        if(song_info['file'])
        {
          song_info['file']['@t'] = form_data['file_type'];
        }
        else
        {
          song_info['file'] = { "@t" : form_data['file_type'] };
        }
      }
      else if(key == 'file_name')
      {
        if(song_info['file'])
        {
          song_info['file']['#text'] = form_data['file_name'];
        }
        else
        {
          song_info['file'] = { "#text" : form_data['file_name'] };
        }
      }
      else
      {
        song_info[key] = form_data[key];
      }
    }
  }

  jsonfile.writeFile(database, content, err => {
    if(err)
    {
      console.error(err);
      res.end(1);
      return Promise.reject("Unable to write to file");
    }
    console.log('Archive edited sucessfully');
  })
}

/* GET home page. */
router.get('/', function(req, res, next) 
{
  getContent().then( (content) => {
    displayPage(res, content.arq.doc);
  })
  .catch( err => displayErrorPage(res, err) );
});

router.get('/:id(\\d+)/', function (req, res, next)
{
  getContent().then( (content) => {
    displayItem(res, content, req.params.id);
  })
  .catch( err => displayErrorPage(res, err) );
})

router.get('/edit-item/:id(\\d+)/', function (req, res, next)
{
  getContent().then( (content) => {
    displayEditItem(res, content, req.params.id);
  })
  .catch( err => displayErrorPage(res, err) );
})

router.get('/add-item/', function (req, res, next)
{
  getContent().then( (content) => {
    displayAddItem(res, content);
  })
  .catch( err => displayErrorPage(res, err) );
})

router.delete('/:id(\\d+)/', function (req,res,next) {
  var id = req.params.id;
  console.log("deleting: " + id);
  deleteArchive(res, id).then( data => {
    res.end('0');
  })
  .catch(err => console.error(err));
})

router.post('/add/', function (req,res,next) {
  getContent().then( (content) => {
    addMusic(content, req.body);
    res.redirect('/');
  })
})

router.put('/edit/:id(\\d+)', function (req, res, next) {
  getContent().then( (content) => {
    editMusic(content, req.params.id, req.body);
    res.end('0');
  })
})

module.exports = router;