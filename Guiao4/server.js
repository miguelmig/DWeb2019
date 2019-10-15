var http = require('http')
var url = require('url')
var fs = require('fs')

const port = 7777; // Default port for our web server

const content_types_by_extension = {
    "ico": "image/x-icon", // favicon.ico
    "xsl": "text/xsl",
    "xml": "text/xml",
    "html": "text/html"
};

function displayErrorPage(res, fileName)
{
    res.writeHead(200, {'Content-Type': "text/html; charset=utf-8"});
    res.write("Error loading the webpage. ");
    if(fileName) 
    {
        res.write("<p>Unable to find resource: <b>" + fileName + "</b></p>");
    }
    res.end();
}

/**
 * @param {String} fileName - The fileName being requested to be loaded
 * @param {ServerResponse} res - Response Object to be filled
 */
function handleSimpleFileRequest(fileName, res)
{
    /* In case the function is called before the server is created */ 
    if(!server)
    {
        console.error("Unable to find server to serve content to.");
        return;
    }

    let extension = fileName.substr(fileName.lastIndexOf('.') + 1)
    let contentType = content_types_by_extension[extension]
    if(!contentType)
    {
        displayErrorPage(res);
        return;
    }

    fs.readFile(fileName, function (err, data) {
        if(err)
        {
            console.error("Unable to find file: " + fileName);
            displayErrorPage(res, fileName);
            return;
        }
        res.writeHead(200, {'Content-Type': contentType + '; charset= utf-8'});
        res.write(data);
        res.end();
    });
}


var server = http.createServer(function (req, res) {
    console.log(req.method + " " + req.url);
    if(req.method != "GET")
    {
        console.error("Invalid request method: " + req.method);
        displayErrorPage(res);
        return;
    }
    /* Parse the url and take the pathname only, ignoring the leading '/' */
    var path = url.parse(req.url, true).pathname.substr(1);
    console.log("Path requested: " + path);
    if(path.length == 0)
    {
        // Request the root directory, let's display index.html instead
        path = "index.html";
    }
    
    if(isNaN(path))
    {
        handleSimpleFileRequest(path, res);
    }
    else
    {
        console.log("Displaying arqsite " + path);
        /* If the path is just a number, display the according arqsite */ 
        handleSimpleFileRequest("dataset/arq" + path + ".xml", res);
    }
})
server.listen(port);

console.log("Servidor à escuta na porta " + port + " ...");

