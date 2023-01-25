"use strict";

const fs	 = require("fs");

const self = function(){
	
}

self.prototype.renderMessage = function(req,res,status,title,msg){
	const v = (fs.existsSync(process.cwd() + '/frontend/' + req.headers.host + "/error" + '.html'))?req.headers.host + "/error":'error';
	res.status(status).render(v, {title: title, msg: msg, class: "danger",status: status, redirectTo: res.redirectTo, __sitename: req.headers.host});	
}

/*Respuesta para 404*/
self.prototype.notFound = function(req,res){
	this.renderMessage(req,res,404, 'Error 404', 'La URL ' +  req.originalUrl + ' no pudo ser procesada');
}

/*Respuesta satisfactoria para APIS*/
self.prototype.APISuccess = function(res){
	res.json({data: true});
}

/*Respuesta erronea para APIS*/
self.prototype.APIError = function(res,e){
	if(e==401){
		res.sendStatus(e);
	}else{
		res.status(500).send({error: e.toString()});
	}
}

/*Responder archivo*/
self.prototype.sendFile = function(res,file){
	if(fs.existsSync(file)){
		res.sendFile(file);
	}else{
		this.renderMessage(res,500,'File not Found', 'El archivo solicitado internamente no existe');
	}
}

/*Renderizar pagina*/
self.prototype.render = function(req,res,view,data){
	if(fs.existsSync(process.cwd() + '/frontend/' + view + '.html')){
		res.status(200).render(view, data);
	}else{
		this.renderMessage(req,res,500,'Page not Found', 'La página no existe');
	}
}

/*Renderizar documento html*/
self.prototype.renderHtml = function(data,req,res){
	res.set('Content-Type', 'text/html');
	res.send(Buffer.from('<!doctype html><html lang="es"><head><meta charset="utf-8"/><meta name="keywords" content="' + ((data[0].tag)?data[0].tag.join(','):'') + '" /><meta name="description" content="' + data[0].resume + '" /><meta name="Author" content="' + process.env.HOST + '" /><title>' + data[0].title + '</title></head><body>' + data[0].content + '</body></html>'));
}

/*Renderizar pagina de error*/
self.prototype.renderError = function(req,res,error){
	this.renderMessage(req,res,500,'Server Error', error.toString());
}

/*Respuesta 401*/
self.prototype.unauthorize = function(req,res){
	if(req.url.indexOf("/api/")>-1){
		res.sendStatus(401);
	}else{
		req.session.redirectTo = req.protocol + '://' + req.headers.host + req.url;
		res.cookie("redirectTo",req.protocol + '://' + req.headers.host + req.url);
		res.redirectTo = req.protocol + '://' + req.headers.host + req.url;
		this.renderMessage(req,res,401,'Acceso restringido','No tiene permisos para ejecutar esta acción');
	}
}

module.exports = new self();