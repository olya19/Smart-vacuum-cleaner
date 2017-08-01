const express = require('express');
let bodyParser = require('body-parser')
let path = require("path");

const app = express();


app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');
app.get('/', (req, res) => {
  console.log(req.url);
  // res.sendFile(path.join(__dirname + '/index.html'));
   res.render('index', {className: "ddd"});
});

app.get('/assets/*', (req, res) => {
   res.sendFile(path.join(__dirname + req.path));
});

app.post('/', (req, res) => {
  console.log(req.body.className);
  let name = req.body.className.toString();
  res.send({newColor: name});

});

app.post('/registration', (req, res) => {

  console.log(req.body.login);
  console.log(req.body.password);
  res.render('index');

});

const server = app.listen(8080, () => {
   const host = server.address().address
   const port = server.address().port
   console.log(`host ${host}, port ${port}`);
});

























/*
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');



function onGetRequest(req, res){
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;
  console.log(pathname  + ' pathname');
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  let ext = path.parse(pathname).ext;
  console.log(ext + ' ext');
  // maps file extention to MIME typere
  const MIME_TYPE = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };

  fs.exists(pathname, (exist) => {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory search for index file matching the extention
    if (fs.statSync(pathname).isDirectory()) {
      pathname += 'index.html';
      console.log(pathname);
      ext = '.html';
    }
    // read file from file system
    fs.readFile(pathname, (err, data) => {
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        console.log(this);
        res.setHeader('Content-type', MIME_TYPE[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });

}

http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  // parse URL
  switch (req.method) {
    case 'GET': onGetRequest(req, res);
      break;
    default: console.log('Can not !');

  }

}).listen(8080);

console.log(`Server listening on port 8080`);

*/
