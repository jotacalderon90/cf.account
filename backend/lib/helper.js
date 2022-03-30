"use strict";

const crypto = require("crypto");
const fs	 = require("fs");
const http 	 = require("http");
const https  = require("https");

const logger = require('./log')('lib.helper');
const mongodb  = require("./mongodb");

const self = function(){
	if(config.recaptcha && config.recaptcha.enabled===true){
		this.captcha = require("express-recaptcha");
		this.captcha.init(config.recaptcha.public,config.recaptcha.private);
		this.captcha.render();
	}else{
		this.captcha = undefined;
	}
}

/*Promesa usada para validar captcha, ejm formulario de contacto*/
self.prototype.recaptcha = function(req){
	return new Promise((resolve,reject)=>{
		if(this.captcha==undefined){
			resolve(true);
		}else{		
			this.captcha.verify(req, function(error){
				if(error){
					return reject(error);
				}else{
					resolve(true);
				}
			});	
		}
	});
}

/*Función que valida Email, ejm en formulario de contacto*/
self.prototype.isEmail = function(email){
	if(email!=undefined && email.trim()!="" && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
		return true;
	}else{
		return false;
	}
}

/*Función que genera string random con largo parametrizable, ejm: hash del usuario*/
self.prototype.random = function(length){
	const possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let text = "";
	for (let i = 0; i < length; i++){
		text += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
	}
	return text;
}

/*Función que encripta string a partir de hash ejm: hash clave del usuario*/
self.prototype.toHash = function(text,hash){
	return crypto.createHmac("sha256", text).update(hash).digest("hex");
}

/*Función que guarda usuario si no existe, ejm: formulario de contacto*/
self.prototype.insertUserIfNotExist = async function(email){
	const e = await mongodb.count("user",{email: email});
	if(e==0){
		const u = {};
		u.email = email;
		u.hash = this.random(10);
		u.password = this.toHash("123456" + u.email,u.hash);
		u.nickname = u.email;
		u.notification = true;
		u.thumb = "/media/img/user.png";
		u.roles = ["user","message"];
		u.created = new Date();
		u.activate = true;
		await mongodb.insertOne("user",u);
		logger.info("nuevo usuario insertado");
	}
}

/*Promesa que sube archivo, ejm: formulario de blog/productos*/
self.prototype.upload_process = function(file,path){
	return new Promise(function(resolve,reject){
		file.mv(path, function(error) {
			if (error){
				return reject(error);
			}else{
				resolve(true);
			}
		});
	});
}

/*Funcion para guardar usuario en documento, ejm: cuando se crea una nota nueva en el blog*/
self.prototype.saveUser = function(user){
	return {
		_id: user._id,
		nickname: user.nickname,
		thumb: user.thumb
	}
}

/*Funcion que desordena array, usada en blog para documentos relacionados*/
self.prototype.randomArray = function(array){
	let new_array = [];
	let used = [];
	for(let i=0;i<array.length;i++){
		let r = Math.round(Math.random() * (array.length-1));
		while(used.indexOf(r)>-1){
			r = Math.round(Math.random() * (array.length-1));
		}
		used.push(r);
		new_array.push(array[r]);
	}
	return new_array;
}

/*Funcion que retorna string a la derecha de*/
self.prototype.strRight = function(content,from){
	return content.substring(content.indexOf(from) + from.length);
}

/*Format number*/
self.prototype.formatNumber = function(number){
	return new Intl.NumberFormat('en-US').format(number);
}








self.prototype.saveLog = async function(req){
	mongodb.insertOne("log",{url: req.originalUrl, ip: this.getRealIP(req), date: new Date(), headers: req.headers, body: req.body, user: req.user});
}

self.prototype.request = function(url){
	const r = (url.indexOf("https://")==0)?https:http;
	return new Promise(function(resolve,reject){
		r.get(url, (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on('end', () => {
				try{
					const json = JSON.parse(data);
					if(json.body){
						resolve(json.body);
					}else{
						resolve(json);
					}					
				}catch(e){
					reject(e);
				}
			});
		}).on("error", (e) => {
			reject(e);
		});
	});
}

self.prototype.getRealIP = function(req){
	try{
		return req.connection.remoteAddress || req.headers["x-real-ip"];
	}catch(e){
		return 'noip';
	}
}

module.exports = new self();