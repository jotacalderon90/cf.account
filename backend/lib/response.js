"use strict";

const fs	 = require("fs");

const self = function(){
	
}

self.prototype.forError = function(res,status,title,msg){
	res.status(status).render("views/messageFromServer", {title: title, msg: msg, class: "danger"});	
}

/*Respuesta para 404*/
self.prototype.notFound = function(req,res){
	this.forError(res,404, 'Error 404', 'La URL ' +  req.originalUrl + ' no pudo ser procesada');
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
		this.forError(res,500,'File not Found', 'El archivo solicitado internamente no existe');
	}
}

/*Renderizar pagina*/
self.prototype.render = function(res,view,data){
	if(fs.existsSync(process.cwd() + config.properties.views + view + '.html')){
		res.status(200).render(view, data);
	}else{
		this.forError(res,500,'Page not Found', 'La página no existe');
	}
}

/*Renderizar documento html*/
self.prototype.renderHtml = function(data,req,res){
	res.set('Content-Type', 'text/html');
	res.send(Buffer.from('<!doctype html><html lang="es"><head><meta charset="utf-8"/><meta name="keywords" content="' + ((data[0].tag)?data[0].tag.join(','):'') + '" /><meta name="description" content="' + data[0].resume + '" /><meta name="Author" content="' + config.properties.host + '" /><title>' + data[0].title + '</title></head><body>' + data[0].content + '</body></html>'));
}

/*Renderizar pagina de error*/
self.prototype.renderError = function(res,error){
	this.forError(res,500,'Server Error', error.toString());
}

/*Respuesta 401*/
self.prototype.unauthorize = function(req,res){
	if(req.url.indexOf("/api/")>-1){
		res.sendStatus(401);
	}else{
		req.session.redirectTo = req.url;
		this.forError(res,401,'Acceso restringido','No tiene permisos para ejecutar esta acción');
	}
}







self.prototype.onError = async function(req,res,e){
	if(req.url.indexOf("/api/")>-1){
		this.onErrorAPI(req,res,e);
	}else {
		this.onErrorRENDER(req,res,e);
	}
}

self.prototype.toRenderError = function(req,e){
	return {onOpen: {app: "promise", action: "messageFromServer", data: {title: e.title|| "Error en el Servidor", msg: e.msg || e.toString(), class: "danger"}}};
}

self.prototype.toRenderSuccess = async function(req,t,e,c){
	return {onOpen: {app: "promise", action: "messageFromServer", data: {title: t, msg: e.toString(), class: c || "success"}}};
}

self.prototype.renderMessage = async function(req,res,t,e,c){
	res.render("index",{...this.toRenderSuccess(req,t,e,c)});
}

self.prototype.onErrorAPI = function(req,res,e){
	if(e==401){
		res.sendStatus(401);
	}else{
		res.status(500).send({error: e.toString()});
	}
}

self.prototype.onErrorRENDER = function(req,res,e){
	if(e==401){
		req.session.redirectTo = req.url;
		res.status(401).render("message", this.toRenderError(req,e));
	}else{
		res.status(500).render("message", this.toRenderError(req,e));
	}
}

module.exports = new self();