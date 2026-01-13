"use strict";

const controlador = require('./lib/02.account.crud/controller');

const logger = require('cl.jotacalderon.cf.framework/lib/log')('api.02.account.crud');
const response = require('cl.jotacalderon.cf.framework/lib/response');
const helper = require('cl.jotacalderon.cf.framework/lib/helper');
const recaptcha = require('cl.jotacalderon.cf.framework/lib/recaptcha');
const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');
const accesscontrol = require('cl.jotacalderon.cf.framework/lib/accesscontrol');
const request = require('cl.jotacalderon.cf.framework/lib/request');

const password = require('./lib/password');

module.exports = {
	
	//@route('/api/account')
	//@method(['post'])
	create: async function(req,res){
		try{
			
			req.user = await accesscontrol.getUser(req);
			if(req.user==null){
				
				if(process.env.CANCREATE!='1'){
					throw("none");
				}
				
				req.body.email = req.body.email.toLowerCase();
				if(!helper.isEmail(req.body.email)){
					throw("El email ingresado no es válido");
				}
				await recaptcha.validate(req);
				if(!password.isValid(req.body.password)){ 
					throw("La contraseña ingresada no es segura");
				}
				const cantXEmail = await mongodb.count("user",{email: req.body.email});
				if(cantXEmail!=0){
					throw("El email ingresado ya está registrado");
				}
				const doc = {};
				doc.email = req.body.email;
				doc.hash = helper.random(10);
				doc.password = helper.toHash(req.body.password + req.body.email,doc.hash);
				doc.nickname = req.body.email;
				doc.notification = true;
				doc.thumb = process.env.HOST_ARCHIVOSPUBLICOS + "/assets/img/user.png";
				doc.roles = ["user"];
				doc.created = new Date();
				doc.activate = false;
				await mongodb.insertOne("user",doc);
				
				if(process.env.HOST_PUSH){
					const headers = {};
					headers['x-api-key'] = process.env.HOST_PUSH_X_API_KEY;
					request.post(process.env.HOST_PUSH + '/api/push/admin',{headers: headers},{title: 'New Account', body: req.body.email});
				}
				
				if(process.env.HOST_MAILING){
					const memo = {};
					memo.to = doc.email;
					memo.subject = "Activación de cuenta"
					memo.hash = process.env.HOST + "/api/account/activate/" + new Buffer(doc.password).toString("base64");
					
					memo.type = 'template';
					memo.template = 'accountActivate.html';
					memo.send = true;
					
					request.post(process.env.HOST_MAILING + '/api/mailing',{},memo);
				}
				response.renderMessage(req,res,200,'Usuario registrado','Se ha enviado un correo para validar su registro','success');
			}else if(req.body.button && req.body.button == 'UPDATE'){
				this.update(req,res);
			}else if(req.body.button && req.body.button == 'DELETE'){
				this.delete(req,res);
			}
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
		}
	},
	
	//@route('/api/account')
	//@method(['get'])
	read: async function(req,res){
		try{
      
      const token = accesscontrol.getToken(req);
      let user;
			if(token != null && token.sub){
				user = await mongodb.findOne("user",token.sub);
			}else{
				user = null;
			}
      
			res.send({data: user});
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
	},
	
	//@route('/api/account')
	//@method(['put'])
	//@roles(['root','admin'])
	update: async function(req,res){
		//al igual que delete, este metodo se llama desde el post con button diferenciador
		try{
			const updated = {
				$set: {
					nickname: req.body.nickname
				}
			};
			let redirect = "/";
			if(!req.user.google && req.body.password!=req.user.password){
				if(!password.isValid(req.body.password)){ 
					throw("La contraseña ingresada no es segura");
				}else{
					updated["$set"]["password"] = helper.toHash(req.body.password + req.user.email,req.user.hash);
					redirect = "/api/account/logout";
				}
			}
			await mongodb.updateOne("user",req.user._id,updated);
			res.redirect(redirect);
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
		}
	},
	
	//@route('/api/account')
	//@method(['delete'])
	//@roles(['root','admin'])
	delete: async function(req,res){
    controlador.delete(req,res);
	}
	
}