"use strict";

const logger = require('./lib/log')('router.account.api.crud');
const response = require('./lib/response');
const helper = require('./lib/helper');
const mongodb = require('./lib/mongodb');
//const push = require('./lib/push');
const accesscontrol = require('./lib/accesscontrol');
const request = require('./lib/requestAsync');

const onError = function(res,e){
	logger.info('ERROR:' + e.toString());
	logger.info(e);
	response.renderError(res,e);
}

const cookie = function(res,cookie){
	if(config.properties.cookie_domain){
		res.cookie("Authorization", cookie, { domain: config.properties.cookie_domain, path: "/", secure: true });
	}else{
		res.cookie("Authorization",cookie);
	}
}

const removeLogged = async function(req){
	if(req.user){
		req.session.destroy();
	}
}

module.exports = {
	
	//@route('/api/account')
	//@method(['post'])
	create: async function(req,res){
		try{
			req.user = await accesscontrol.getUser(req);
			if(req.user==null){
				req.body.email = req.body.email.toLowerCase();
				if(!helper.isEmail(req.body.email)){
					throw("El email ingresado no es válido");
				}
				await helper.recaptcha(req);
				if(req.body.password==undefined || req.body.password==null || req.body.password.length < 5){ 
					throw("La contraseña ingresada debe tener al menos 5 caracteres");
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
				doc.thumb = config.properties.archivospublicos + "/media/img/user.png";
				doc.roles = ["user"];
				doc.created = new Date();
				doc.activate = (config.smtp && config.smtp.enabled)?false:true;
				await mongodb.insertOne("user",doc);
				//push.notificateToAdmin("new user",req.body.email);
				if(config.properties.mailing){
					const memo = {};
					memo.to = doc.email;
					memo.bcc = config.properties.admin;
					memo.subject = "Activación de cuenta"
					memo.hash = config.properties.host + "/api/account/activate/" + new Buffer(doc.password).toString("base64");
					
					memo.type = 'template';
					memo.template = 'accountActivate.html';
					memo.send = true;
					
					request.post(config.properties.mailing + '/api/mailing',{headers: {}},memo);
				}
				response.renderMessage(res,200,'Usuario registrado',((config.smtp && config.smtp.enabled)?'Se ha enviado un correo para validar su registro':'Se ha completado su registro correctamente'),'success');
			}else if(req.body.button && req.body.button == 'UPDATE'){
				this.update(req,res);
			}else if(req.body.button && req.body.button == 'DELETE'){
				this.delete(req,res);
			}else{				
				
			}
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/account')
	//@method(['get'])
	read: async function(req,res){
		try{
			res.send(await accesscontrol.getUser(req));
		}catch(e){
			res.json({error: e.toString()});
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
				if(req.body.password==undefined || req.body.password==null || req.body.password.length < 5){
					throw("La contraseña ingresada debe tener al menos 5 caracteres");
				}else{
					updated["$set"]["password"] = helper.toHash(req.body.password + req.user.email,req.user.hash);
					redirect = "/api/account/logout";
				}
			}
			await mongodb.updateOne("user",req.user._id,updated);
			res.redirect(redirect);
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/account')
	//@method(['delete'])
	//@roles(['root','admin'])
	delete: async function(req,res){
		//al igual que update, este metodo se llama desde el post con button diferenciador
		try{
			await removeLogged(req);
			cookie(res,"null");
			await mongodb.deleteOne("user",req.user._id);
			response.renderMessage(res,200,'Usuario eliminado','Se ha eliminado su cuenta satisfactoriamente','success');
		}catch(e){
			onError(res,e);
		}
	}
	
}