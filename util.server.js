const http = require ("http");
const url = require('url');
const fs = require('fs');


exports.server = (arr)=> {
  http.createServer(function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(arr))
  }).listen(3000);
  console.log(`\Sirviendo imágenes descargadas en http://localhost:3000\nAcceda al fichero "index.html"`);
}