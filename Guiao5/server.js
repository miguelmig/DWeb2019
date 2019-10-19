var http = require('http')
var url = require('url')
var pug = require('pug')
var fs = require('fs')
var jsonfile = require('jsonfile')

var {parse} = require('querystring')

var database =  "tarefas.json"
var index = "index.pug"

const port = 5005;

var server = http.createServer( (req, res) => {
    var parsed_url = url.parse(req.url, true);
    var query = parsed_url.query;

    console.log(req.method + " " + parsed_url.pathname);

    if(req.method == "GET")
    {
        if(parsed_url.pathname == '/' || (parsed_url.pathname == "/index")) 
        {
            jsonfile.readFile(database)
                .then(data => displayIndexPage(res, data))
                .catch(err => {
                    if(err['code'] == 'ENOENT')
                    {
                        console.log("Database file couldn't be found, creating an empty one.");
                        // The database is not yet created, let's try to do it.
                        initDB()
                            .then( () => displayIndexPage(res, []) )
                            .catch( err => {
                                console.error(err);
                                displayErrorPage(res, "Erro a criar a base de dados de tarefas");
                            })
                    }
                    else
                    {
                        console.error(err);
                        displayErrorPage(res, "Erro a obter a base de dados de tarefas");
                    }
                });
        }
        else if(parsed_url.pathname == "/w3.css")
        {
            fs.readFile("stylesheets/w3.css", (err, data) => {
                if(err)
                {
                    res.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    res.write("<p> Erro: " + err + " </p>");
                    return;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/css; charset=utf-8'
                });
                res.write(data);
                res.end();
            });
        }
        else 
        {
            console.log("Non-existent path for GET method: " + parsed_url.pathname);
            if(parsed_url.pathname != "/favicon.ico")
                displayErrorPage(res, "ERRO: " + parsed_url.pathname + " não é acessível...");
        }
    }
    else if(req.method == "POST")
    {
        if(parsed_url.pathname == "/tarefa")
        {
            recuperaInfo(req, data => registarTarefa(res, data));

        }
        else if(parsed_url.pathname == "/remover")
        {
            recuperaInfo(req, data => removerTarefa(res, data));
        }
    }
    else 
    {
        console.log("Invalid request type");
        displayErrorPage(res, "ERRO: " + req.method + " não suportado...");
    }

}).listen(port, () => {
    console.log("A ouvir na porta " + port + "....");
});

function recuperaInfo(request, callback)
{
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded')
    {
        let body = ''
        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            callback(parse(body));
        });
    }
    // Not parsing multipart yet

}

function displayPugPage(res, pugFile, pugVars)
{
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"});

    res.write(pug.renderFile(pugFile, pugVars));

    res.end();
}

function displayErrorPage(res, error)
{
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });

    var vars = {}
    if(error)
    {
        vars.e = error;
    }

    res.write(pug.renderFile("erro.pug", vars))

    res.end();
}

function displayIndexPage(res, data)
{
    if(!data)
    {
        jsonfile.readFile(database)
            .then((tasks_data) => displayIndexPage(res, tasks_data))
            .catch( err => displayErrorPage(res, err))
        return;
    }

    var vars = {}
    vars['tarefas'] = data;
    displayPugPage(res, index, vars);
}

function initDB()
{
    return jsonfile.writeFile(database, []);
}

function registarTarefa(res, tarefa)
{
    jsonfile.readFile(database, (err, data) => {
        if(err)
        {
            console.error(err);
            displayErrorPage(res, err);
            return;
        }

        var i;
        var max = 0;
        for(i = 0; i < data.length; i++)
        {
            if(data[i].id > max)
            {
                max = data[i].id;
            }
        }

        tarefa['id'] = max + 1;
        data.push(tarefa);
        jsonfile.writeFile(database, data)
            .then( () => { 
                console.log("Registo adicionado com sucesso");
                displayIndexPage(res, data);
            })
            .catch( err => { 
                    console.error(err);
                    displayErrorPage(res, err);
            });
    });

}

function removerTarefa(res, info)
{
    const remove_id = info['id'];
    if(!remove_id)
    {
        console.error("Invalid POST parameters for removing a Task");
        displayErrorPage(res, "Malformed POST request");
        return;
    }

    console.log("Remover registo " + remove_id);
    jsonfile.readFile(database, (err, data) => {
        if(err)
        {
            console.error(err);
            displayErrorPage(res, "Erro a obter a base de dados de tarefas");
            return;
        }
        
        var i;
        for(i = 0; i < data.length; i++)
        {
            if(data[i].id == remove_id)
            {
                data.splice(i, 1);
            }
        }

        jsonfile.writeFile(database, data, err => { 
            if(err)
            {
                console.error(err);
            }
            else
            {
                console.log("Registo " + remove_id + " removido com sucesso");
            }
        });

        displayIndexPage(res, data);
    });
}