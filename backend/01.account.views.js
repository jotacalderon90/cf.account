"use strict";

const googleapis = require('./lib/googleapis');

module.exports = {
	
	//@route('/')
	//@method(['get'])
	//@roles(['root','admin','user'])
	renderDocument: function(req,res){
		res.render('account/01.perfil/_',{user: req.user});
	},
	
	//@route('/form')
	//@method(['get'])
	renderForm: function(req,res){
		if(process.env.CANCREATE=='1'){
			res.render('account/02.form/_', {action: '/api/account'});
		}else{
			res.redirect("/");
		}
	},
	
	//@route('/login')
	//@method(['get'])
	renderLogin: function(req,res){
		res.render('account/03.login/_', {google_auth: googleapis.getURL()});
	},
	
	//@route('/forget')
	//@method(['get'])
	renderForget: function(req,res){
		if(process.env.CANRECOVERY=='1'){
			res.render('account/04.forget/_');
		}else{
			res.redirect("/");
		}
	},
	
	//@route('/recovery')
	//@method(['get'])
	renderRecovery: function(req,res){
		if(process.env.CANRECOVERY=='1'){
			res.render('account/05.recovery/_');
		}else{
			res.redirect("/");
		}
	},
	
	//@route('/admin/admin')
	//@method(['get'])
	//@roles(['root','admin'])
	renderAdmin: function(req,res){
		res.render('account/admin/_',{user: req.user});
	},
	
	//@route('/politicas-de-privacidad')
	//@method(['get'])
	renderPoliticasPrivacidad: function(req,res){
		res.render('account/politicas');
	},
	
	//@route('/condiciones-del-servicio')
	//@method(['get'])
	renderCondicionesServicio: function(req,res){
		res.render('account/condiciones');
	},
	
	//@route('/form-admin')
	//@method(['get'])
	renderFormAdmin: function(req,res){
		if(process.env.CANCREATEADMIN=='1'){
			res.render('account/02.form/_', {action: '/api/admin/account/createadmin'});
		}else{
			res.redirect("/");
		}
	}
	
}