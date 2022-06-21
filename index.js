'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://127.0.0.1:27017/api_rest_blog", { useNewUrlParser: true })
.then(() => {
    
    console.log("Conexion exitosa :D");
    
    //CREAR SERVIDOR y escuchar peticiones HTTP
    app.listen(port, () => {
        console.log("Servidor escuchando correctamente");
    });
    
});


