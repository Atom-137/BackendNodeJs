'use strict'

var validator = require('validator');
const article = require('../models/article');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');
const { exists } = require('../models/article');



var controller = {
    
    datosCurso: (req,res) =>{
        var hola = req.body.hola;
        
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor : 'ss- Muss',
            url : 'facebook.com',
            hola
            
        });
        
    },
    test : (req, res) =>{
        
        return res.status(200).send({
            message : 'Soy un test'
        });
        
    },
    
    save: (req,res) => {
        
        //recoger parametros por POST
        var params = req.body;
        
        
        //Validar datos con validator
        try{
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
            
            
            
        }catch(err){
            
            return res.status(200).send({
                status : 'error',
                message : 'Faltan datos por enviar'
            });
        }
        
        if(validateContent && validateTitle){
            
            //crear objeto a guardar
            var article = new Article();
            
            //asignar valores
            article.title = params.title;
            article.content = params.content;
            if(params.image){

                article.image = params.image;
            }else{
                article.image = null;
            }
          
            
            //guardar el articulo
            article.save((err, articleStored) =>{
                if(err  || !articleStored){
                    
                    return res.status(404).send({
                        status : 'error',
                        message : 'El articulo no se guardo'
                    });
                    
                }
                
                //devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article : articleStored
                });
                
            });
            
            
            
            
        }else{
            return res.status(200).send({
                status : 'error',
                message : 'Faltan datos por enviar!'
            });
            
        }
        
    },
    
    getArticles: (req,res) =>  {
        
        
        var query = Article.find({});
        var last = req.params.last;
        
        if (last || last != undefined){
            query.limit(4); 
        }
        
        
        
        //find
        query.sort('-date').exec((err,articles)=>{
            
            if(err){
                return res.status(500).send({
                    status : 'error',
                    message : 'Error al devolver articulos'
                });
            }
            
            
            if(!articles){
                return res.status(404).send({
                    status : 'error',
                    message : 'No se encontraron articulos'
                });
            }
            return res.status(200).send({
                status : 'success',
                articles
            });
            
        });
        
        
        
    },
    
    getArticle : (req, res) =>{
        
        // recorrer id de la url
        var articleId = req.params.id
        
        //comprobar que existe
        if(!articleId || articleId == null){

            return res.status(404).send({
                status : 'error',
                message : 'No se encontraro el articulo',
                
                
            });
            
       }
        //buscar articulo
        
        Article.findById(articleId, (err, article) => {
            
            if(err ||!article){
                return res.status(404).send({
                    status : 'error',
                    message : 'No existe el articulo'
                    
                });
                
            }
            
           
            return res.status(200).send({
                status : 'success',
                article
            });
            
        })
        //devolver en json
        
        
    },
    
    update: (req,res) => {
        
        //recoger el id del articulo por url
        
        var articleId= req.params.id;
        //recoger los datos que llegan por put
        var params = req.body;
        //validar los datos
        
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            
        } catch (error) {
            
            return res.status(200).send({
                status : 'failed',
                message: 'Faltan datos por enviar'
            });
        }
        
        if (validate_title && validate_content){
            //Find and update            
            Article.findOneAndUpdate({_id:articleId}, params, {new: true},(err,articleUpdated) =>{
                if(err){
                    return res.status(500).send({
                        status : 'failed',
                        message: 'Error al actualizar'
                    });
                    
                }
                if(!articleUpdated){
                    
                    return res.status(404).send({
                        status : 'failed',
                        message: 'No existe el articulo'
                    });
                }
                return res.status(200).send({
                    status : 'success',
                    article: articleUpdated 
                });
            });
        }else{
            
            //devolver respuesta
            return res.status(200).send({
                status : 'failed',
                message: 'La validacion no es correcta'
            });
            
        }
        
        
    },
    delete: (req,res) => {
        //recoger el id
        var articleId = req.params.id;
        
        //find and delete
        
        Article.findOneAndDelete({_id:articleId}, (err, articleRemoved) =>{
            
            if(err){
                //devolver respuesta
                return res.status(500).send({
                    status : 'failed',
                    message: 'Error al borrar'
                });
            }
            
            if(!articleRemoved){
                
                //devolver respuesta
                return res.status(404).send({
                    status : 'failed',
                    message: 'No se encontro el articulo'
                });
            }
            
            return res.status(200).send({
                status: 'success',
                article: articleRemoved                
            });
            
        });
        
    },
    
    upload : (req, res) => {
        //configurar modulo connect multiparty router/article.js (hecho en router/article.js)
        
        
        //recoger el vfichero de la peticion
        var file_name = 'Imagen no subida...';
        
        if(!req.files){
            
            return req.status(404).send({
                status : 'error',
                message : file_name
            });
        }
        
        //conseguir el nombre y la extension del archivo 
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/');
        
        //nombre del archivo
        var file_name = file_split[2];
        
        //extension del fichero 
        
        var extension_split = file_name.split('.');
        var file_ext = extension_split[1];
        
        
        //Comprobar la extension y borrar si no es valida
        
        if(file_ext !='png' && file_ext !='jpg' && file_ext !='jpeg' && file_ext !='gif'){
            //borrar el archivo
            fs.unlink(file_path, (err) =>{
                return res.status(200).send({
                    status : 'error',
                    message : 'La extension de la imagen no es valida'
                });
            });
            
        }else{
            //Si todo es valido 
            //sacando id de la url
            var articleId = req.params.id;

            if(articleId){
                Article.findOneAndUpdate({_id:articleId},{image: file_name}, {new: true},(err,articleUpdated) =>{
                    //buscar el articulo, asignarle el nombre de la imagen y actualizar
                    if(err || !articleUpdated){
                        
                        return res.status(200).send({
                            status : 'error',
                            message : 'Error al guardar la imagen de articulo'
                            
                        });
                        
                    }
                    return res.status(200).send({
                        status : 'success',
                        article : articleUpdated
                        
                    });

                });

            }else{
                return res.status(200).send({
                    status : 'success',
                    image : file_name            
                });
                
            }

        }
        
        
    },//end upload file
    
    getImage : (req, res) =>{
        
        var file = req.params.image;
        var path_file = './upload/articles/'+file;
        
        
        
        fs.exists(path_file,(exists) => {
            // console.log(exists);
            if(exists){
                
                return res.sendFile(path.resolve(path_file));
                
            }else{
                
                return res.status(404).send({
                    status : 'error',
                    message : 'La imagen no existe'
                    
                    
                });
            }
        });
        
        
    },
    search : (req, res) => {
        
        //Sacar string a buscar
        
        var searchString = req.params.search;
        //Find or
        
        Article.find({"$or" :[
            {"title": {"$regex": searchString, "$options":"i"}},
            {"content": {"$regex": searchString, "$options":"i"}}
            
        ]})
        .sort([['date','descending']])
        .exec((err,articles)=>{
            
            if(err){
                return res.status(500).send({
                    status : 'error',
                    message : 'Error en la peticion'
                });
                
            }
            if(!articles || articles.length <=0){
                return res.status(404).send({
                    status : 'error',
                    message : 'No hay articulos que conicidan con tu busqueda'
                });
                
            }
            
            return res.status(200).send({
                status : 'success',
                articles

            });
            
        })       
    }
    
};

module.exports = controller;