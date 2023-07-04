"use strict";

const googleapis = require('./lib/googleapis');

module.exports = {
	
	//@route('/')
	//@method(['get'])
	//@roles(['root','admin','user'])
	renderDocument: function(req,res){
		res.render('account/perfil/_',{user: req.user});
	},
	
	//@route('/form')
	//@method(['get'])
	renderForm: function(req,res){
		res.render('account/form/_');
	},
	
	//@route('/login')
	//@method(['get'])
	renderLogin: function(req,res){
		res.render('account/login/_', {google_auth: googleapis.getURL()});
	},
	
	//@route('/forget')
	//@method(['get'])
	renderForget: function(req,res){
		res.render('account/forget/_');
	},
	
	//@route('/recovery')
	//@method(['get'])
	renderRecovery: function(req,res){
		res.render('account/recovery/_');
	},
	
	//@route('/admin/admin')
	//@method(['get'])
	//@roles(['root','admin'])
	renderAdmin: function(req,res){
		res.render('account/admin/index/_',{user: req.user});
	},
	
	//@route('/politicas-de-privacidad')
	//@method(['get'])
	renderPoliticasPrivacidad: function(req,res){
		res.render('account/contenido/politicas');
	},
	
	//@route('/condiciones-del-servicio')
	//@method(['get'])
	renderCondicionesServicio: function(req,res){
		res.render('account/contenido/condiciones');
	}
	
}