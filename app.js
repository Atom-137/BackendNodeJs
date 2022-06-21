'use strict'

//cargar modulos node 
var express = require('express');
var bodyParse = require('body-parser');
const bodyParser = require('body-parser');


//ejecutar express
var app = express();


//cargar ficheros rutas


// Middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Anadir prefijos a rutas

//Ruta metodo de prueba
var article_routes = require('./routes/article');
app.use('/api',article_routes); 


// Exportar modulo (fichero actual)
    
module.exports = app;
    
    