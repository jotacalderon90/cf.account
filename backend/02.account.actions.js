"use strict";

const logger = require('./lib/log')('router.02.account.crud');
const response = require('./lib/response');
const helper = require('./lib/helper');
const mongodb = require('./lib/mongodb');
//const push = require('./lib/push');
const mailing = require('./lib/mailing');
const jwt = require('./lib/jwt');

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
			if(config.smtp && config.smtp.enabled===true){
				const memo = {};
				memo.to = doc.email;
				memo.subject = "Activación de cuenta"
				memo.nickname = doc.nickname;
				memo.hash = config.properties.host + "/account/activate/" + new Buffer(doc.password).toString("base64");
				memo.html = render.process("memo.activate.html", memo);
				await mailing.send(memo);
			}
			response.renderMessage(res,200,'Usuario registrado',((config.smtp && config.smtp.enabled)?'Se ha enviado un correo para validar su registro':'Se ha completado su registro correctamente'),'success');
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/login')
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
			cookie(res,jwt.encode(rows[0]));
			//push.notificateToAdmin("user login",req.body.email);
			if(req.session.redirectTo){
				res.redirect(req.session.redirectTo);
			}else{
				res.redirect("/");
			}
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/logout')
	//@method(['get'])
	logout: async function(req,res){
		try{
			await removeLogged(req);
			cookie(res,"null");
			res.redirect("/login");
		}catch(e){
			helper.onError(req,res,e);
		}
	}
	
}