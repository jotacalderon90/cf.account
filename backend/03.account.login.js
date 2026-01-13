"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')('api.03.account.login');
const response = require('cl.jotacalderon.cf.framework/lib/response');
const helper = require('cl.jotacalderon.cf.framework/lib/helper');
const recaptcha = require('cl.jotacalderon.cf.framework/lib/recaptcha');
const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');
const accesscontrol = require('cl.jotacalderon.cf.framework/lib/accesscontrol');
const request = require('cl.jotacalderon.cf.framework/lib/request');
const googleapis = require('./lib/googleapis');

const session = require('./lib/session');

const password = require('./lib/password');

module.exports = {
	
	//@route('/api/account/login')
	//@method(['post'])
	login: async function(req,res){
		try{
			await recaptcha.validate(req);
			req.body.email = req.body.email.toLowerCase();
			let rows = await mongodb.find("user",{email: req.body.email, activate: true});
			if(rows.length!=1){
				throw new Error("Los datos ingresados no corresponden .1");
			}
			/*if(helper.toHash(req.body.password+req.body.email,rows[0].hash) != rows[0].password){
				throw("Los datos ingresados no corresponden");
			}*/
      const isValidPassword = await password.verify(req.body.password, rows[0].password);
      if(!isValidPassword) {
        throw new Error("Los datos ingresados no corresponden .2");
      }
			
      const jwt = accesscontrol.encode(rows[0]);
			
      session.create(req, res , jwt, req.body.email);
      
			if(process.env.HOST_PUSH){
				const headers = {};
				headers['x-api-key'] = process.env.HOST_PUSH_X_API_KEY;
				request.post(process.env.HOST_PUSH + '/api/push/admin',{headers: headers},{title: 'Login ' + (new Date().toISOString()), body: req.body.email});
			}
			
			if(req.body.jwt===true){
				res.send({data:jwt});
			}else{
        if(req.query.redirectTo && req.query.redirectTo.trim()!='' && req.query.redirectTo.trim()!='undefined'){
          res.redirect(301, req.query.redirectTo);
        }else{
          res.redirect("/");
        }	
			}
			
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
		}
	},
	
	//@route('/api/account/logout')
	//@method(['get'])
	logout: async function(req,res){
		try{
			
      session.destroy(req, res);
      
			if(req.query.jwt){
				res.send({data: true});
			}else{
				res.redirect("/login");
			}
			
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
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
			response.renderMessage(req,res,200,'Usuario activado','Se ha completado su registro satisfactoriamente','success');
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
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
			response.renderMessage(req,res,200,'Usuario desactivado','Se ha completado su desactivación satisfactoriamente','success');
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
		}
	},
	
	//@route('/api/account/forget')
	//@method(['post'])
	forget: async function(req,res){
		try{
			
			if(process.env.CANRECOVERY!='1'){
				throw("none");
			}
			
			await recaptcha.validate(req);
			req.body.email = req.body.email.toLowerCase();
			const user = await mongodb.find("user",{email: req.body.email});
			if(user.length!=1){
				throw("Error al obtener usuario");
			}
			
			if(process.env.HOST_MAILING){
				const memo = {};
				memo.to = req.body.email;
				memo.subject = "Reestablecer contraseña"
				memo.hash = process.env.HOST + "/api/account/recovery?hash=" + new Buffer(user[0].password).toString("base64");
				
				memo.type = 'template';
				memo.template = 'accountRecovery.html';
				memo.send = true;
				
				request.post(process.env.HOST_MAILING + '/api/mailing',{},memo);
			}
			
			response.renderMessage(req,res,200,'Recuperación de cuenta','Se ha enviado un correo para poder reestablecer su contraseña','success');
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
		}
	},
	
	//@route('/api/account/recovery')
	//@method(['get','post'])
	recovery: async function(req,res){
		try{
			
			if(process.env.CANRECOVERY!='1'){
				throw("none");
			}
			
			switch(req.method.toLowerCase()){
				case "get":
					res.render('admin/recovery', {hash: req.query.hash});
				break;
				case "post":
					await recaptcha.validate(req);
					const user = await mongodb.find("user",{password:  new Buffer(req.body.hash,"base64").toString("ascii")});
					if(user.length!=1){
						throw("Los datos ingresados no corresponden");
					}
					const updated = {
            $set: {
              //password: helper.toHash(req.body.password + user[0].email,user[0].hash)
              password: password.hash(req.body.password)
            }
          };
					await mongodb.updateOne("user",user[0]._id,updated);
					
					response.renderMessage(req,res,200,'Actualización de contraseña','Se ha actualizado su contraseña correctamente','success');
				break;
			}
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
		}
	},
	
	//@route('/api/account/googleoauth')
	//@method(['get'])
	loginGoogleGetURL: async function(req,res){
		try{
			res.json({data: googleapis.getURL()});
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
	},
	
	//@route('/api/account/googleoauth/callback')
	//@method(['get'])
	loginGoogleExecute: async function(req,res){
		try{
			const user = await googleapis.getUserInfo(req.query.code);
			let row = await mongodb.find("user",{email: user.emails[0].value});
			if(row.length!=1){
				row = {};
				row.email = user.emails[0].value;
				row.hash = helper.random(10);
				//row.password = helper.toHash(row.hash + user.emails[0].value,row.hash);
				//row.password: password.hash(user.emails[0])
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
						thumb: user.image.url,
						google: user
					}
				};
				row = row[0];
				await mongodb.updateOne("user",row._id,updated);
			}
      
      const jwt = accesscontrol.encode(row);
      
			session.create(req, res, jwt, email);
      
			if(process.env.HOST_PUSH){
				const headers = {};
				headers['x-api-key'] = process.env.HOST_PUSH_X_API_KEY;
				request.post(process.env.HOST_PUSH + '/api/push/admin',{headers: headers},{title: 'Login Google ' + (new Date().toISOString()), body: req.email});
			}
			
      logger.info('redirecciona a /');
      res.redirect("/");
      
		}catch(error){
			logger.error(error);
			response.renderError(req,res,error);
		}
	}
}