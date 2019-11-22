var express = require('express');
var router = express.Router();
const fs = require('fs')
var ficheiros = require('../controllers/ficheiros')

var FicheiroModel = require('../models/ficheiros')

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
/* GET users listing. */
router.get('/ficheiros', function(req, res, next) {
  ficheiros.listar()
  .then(data => res.jsonp(data))
  .catch(err => res.status(500).jsonp(err));
});

router.delete('/ficheiros/:id', function(req,res,next) {
  ficheiros.apagar(req.params.id)
  .then( data => {
      // Apagar o ficheiro agora
      let filePath = path.join(__dirname, "..", "public", "ficheiros", data.originalname);
      fs.unlink(filePath, function(err) {
        if(err)
        {
          res.status(500).jsonp(err);
          console.error("Erro a apagar o ficheiro('"+data.originalname+"'): " + err);
        }
        console.log("Ficheiro '" + data.originalname + "' apagado com sucesso!");
      });
  })
  .catch(err => res.status(500).jsonp(err))
});

router.post('/ficheiros', upload.array('ficheiro'), function(req,res) {
  var promises = [];
  console.log("Form data: ");
  console.dir(req.body);
  console.log("Files: ");
  console.dir(req.files);

  for(let i = 0; i < req.files.length; i++)
  {
    var current_file = req.files[i];
    let oldPath = __dirname + "/../" + current_file.path;
    let newPath = __dirname + "/../public/ficheiros/" + current_file.originalname;
    
    fs.rename(oldPath, newPath, function(err) {
      if(err) throw err
    })

    let data = new Date();

    let novoFicheiro = new FicheiroModel({
      data: data.toISOString(),
      desc: req.body.desc[i],
      name: current_file.originalname,
      mimetype: current_file.mimetype,
      size: current_file.size
    })
    
    promises.push(novoFicheiro.save());
  }

  Promise.all(promises)
    .then(values => {
      console.log('Ficheiros guardado com sucesso!');
      res.redirect('/');
    })
    .catch(err => {
        console.error("Erro a guardar um ficheiro: " + err);
        res.status(500).jsonp(err);
    });
})
module.exports = router;
