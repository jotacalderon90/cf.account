"use strict";

const logger = require('./lib/log')('router.account.api.login');
const response = require('./lib/response');
const helper = require('./lib/helper');
const mongodb = require('./lib/mongodb');
//const push = require('./lib/push');
const accesscontrol = require('./lib/accesscontrol');
const googleapis = require('./lib/googleapis');

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
	
	//@route('/api/account/login')
	//@method(['post'])
	login: async function(req,res){
		try{
			await helper.recaptcha(req);
			req.body.email = req.body.email.toLowerCase();
			let rows = await mongodb.find("user",{email: req.body.email, activate: true});
			if(rows.length!=1){
				throw("Los datos ingresados no corresponden");
			}
			if(helper.toHash(req.body.password+req.body.email,rows[0].hash) != rows[0].password){
				throw("Los datos ingresados no corresponden");
			}
			cookie(res,accesscontrol.encode(rows[0]));
			//push.notificateToAdmin("user login",req.body.email);
			
			if(req.headers.referer.indexOf('redirectoTo=')>-1){
				res.redirect(301, helper.strRight(req.headers.referer,'redirectoTo='));
			}else{
				res.redirect("/");
			}
			/*
			if(req.session.redirectTo){
				res.redirect(req.session.redirectTo);
			}else{
				res.redirect("/");
			}
			*/
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/account/logout')
	//@method(['get'])
	logout: async function(req,res){
		try{
			await removeLogged(req);
			cookie(res,"null");
			res.redirect("/login");
		}catch(e){
			helper.onError(req,res,e);
		}
	},
	
	//@route('/api/account/activate/:hash')
	//@method(['get'])
	activate: async function(req,res){
		try{
			
			const hash = new Buffer(req.params.hash, "base64").toString("ascii");
			const row = await mongodb.find("user",{password: hash});
			if(row.length!=1){
				throw("Error al obtener usuario asociado al hash");
			}
			row[0].activate = true;
			await mongodb.updateOne("user",row[0]._id,row[0]);
			//push.notificateToAdmin("user activate",row[0].email);
			response.renderMessage(res,200,'Usuario activado','Se ha completado su registro satisfactoriamente','success');
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/account/desactivate/:hash')
	//@method(['get'])
	desactivate: async function(req,res){
		try{
			
			const hash = new Buffer(req.params.hash, "base64").toString("ascii");
			const row = await mongodb.find("user",{password: hash});
			if(row.length!=1){
				throw("Error al obtener usuario asociado al hash");
			}
			row[0].activate = false;
			await mongodb.updateOne("user",row[0]._id,row[0]);
			//push.notificateToAdmin("user desactivate",row[0].email);
			response.renderMessage(res,200,'Usuario desactivado','Se ha completado su desactivación satisfactoriamente','success');
		}catch(e){
			helper.onError(req,res,e);
		}
	},
	
	//@route('/api/account/forget')
	//@method(['post'])
	forget: async function(req,res){
		try{
			
			await helper.recaptcha(req);
			req.body.email = req.body.email.toLowerCase();
			const user = await mongodb.find("user",{email: req.body.email});
			if(user.length!=1){
				throw("Error al obtener usuario");
			}
			
			if(config.properties.mailing){
				const memo = {};
				memo.to = req.body.email;
				memo.bcc = config.properties.admin;
				memo.subject = "Reestablecer contraseña"
				memo.hash = config.properties.host + "/api/account/recovery?hash=" + new Buffer(user[0].password).toString("base64");
				
				memo.type = 'template';
				memo.template = 'accountRecovery.html';
				memo.send = true;
				
				request.post(config.properties.mailing + '/api/mailing',{headers: {}},memo);
			}
			//push.notificateToAdmin("user forget",req.body.email);
			response.renderMessage(res,200,'Recuperación de cuenta','Se ha enviado un correo para poder reestablecer su contraseña','success');
		}catch(e){
			onError(req,res,e);
		}
	},
	
	//@route('/api/account/recovery')
	//@method(['get','post'])
	recovery: async function(req,res){
		try{
			
			switch(req.method.toLowerCase()){
				case "get":
					res.render('recovery', {hash: req.query.hash});
				break;
				case "post":
					await helper.recaptcha(req);
					const user = await mongodb.find("user",{password:  new Buffer(req.body.hash,"base64").toString("ascii")});
					if(user.length!=1){
						throw("Los datos ingresados no corresponden");
					}
					const updated = {$set: {password: helper.toHash(req.body.password + user[0].email,user[0].hash)}};
					await mongodb.updateOne("user",user[0]._id,updated);
					//push.notificateToAdmin("user recovery",user[0].email);
					response.renderMessage(res,200,'Actualización de contraseña','Se ha actualizado su contraseña correctamente','success');
				break;
			}
		}catch(e){
			onError(req,res,e);
		}
	},
	
	//@route('/api/account/google_auth')
	//@method(['get'])
	getURL: async function(req,res){
		try{
			res.json({data: googleapis.getURL()});
		}catch(e){
			res.json({data: null, error: e});
		}
	},
	
	//@route('/user/auth/google/callback')
	//@method(['get'])
	google_login: async function(req,res){
		try{
			//esta url me gustaria cambiar pero debo meterme en google :S
			const user = await googleapis.getUserInfo(req.query.code);
			if(user.error){
				throw(user.error);
			}
			let row = await mongodb.find("user",{email: user.emails[0].value});
			if(row.length!=1){
				row = {};
				row.email = user.emails[0].value;
				row.hash = helper.random(10);
				row.password = helper.toHash(row.hash + user.emails[0].value,row.hash);
				row.nickname = user.displayName;
				row.notification = true;
				row.thumb = user.image.url;
				row.roles = ["user"];
				row.created = new Date();
				row.activate = true
				row.google = user;
				await mongodb.insertOne("user",row);
			}else{
				let updated = {
					$set: {
						//nickname: user.displayName,
						//thumb: user.image.url,
						google: user
					}
				};
				row = row[0];
				await mongodb.updateOne("user",row._id,updated);
			}
			cookie(res,accesscontrol.encode(row));
			//push.notificateToAdmin("user login by google",row.email);
			if(req.session.redirectTo){
				res.redirect(req.session.redirectTo);
			}else{
				res.redirect("/");
			}
		}catch(e){
			onError(res,e);
		}
	}
}