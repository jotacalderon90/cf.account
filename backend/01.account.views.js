"use strict";

const controlador = require('./lib/01.account.views/controller');

module.exports = {
	
	//@route('/')
	//@method(['get'])
	//@roles(['root','admin','user'])
	renderIndex: function(req,res){
		controlador.renderIndex(req,res);
	},
	
	//@route('/form')
	//@method(['get'])
	renderForm: function(req,res){
		controlador.renderForm(req,res);
	},
	
	//@route('/login')
	//@method(['get'])
	renderLogin: function(req,res){
		controlador.renderLogin(req,res);
	},
		
	//@route('/forget')
	//@method(['get'])
	renderForget: function(req,res){
		controlador.renderForget(req,res);
	},

	//@route('/recovery')
	//@method(['get'])
	renderRecovery: function(req,res){
		controlador.renderRecovery(req,res);
	},
	
	//@route('/politicas-de-privacidad')
	//@method(['get'])
	renderPoliticasPrivacidad: function(req,res){
		controlador.renderPoliticasPrivacidad(req,res);
	},
	
	//@route('/condiciones-del-servicio')
	//@method(['get'])
	renderCondicionesServicio: function(req,res){
		controlador.renderCondicionesServicio(req,res);
	},
	
	//@route('/admin/admin')
	//@method(['get'])
	//@roles(['root','admin'])
	renderAdmin: function(req,res){
		controlador.renderAdmin(req,res);
	},
	
	//@route('/form-admin')
	//@method(['get'])
	renderFormAdmin: function(req,res){
		controlador.renderFormAdmin(req,res);
	}
	
}