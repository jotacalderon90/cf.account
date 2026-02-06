"use strict";

const controlador = require('./lib/02.views/controller');

module.exports = {
	
  /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista index
   *     description: obtiene vista index
   */
	//@route('/')
	//@method(['get'])
	//@roles(['root','admin','user'])
	renderIndex: function(req,res){
		controlador.renderIndex(req,res);
	},
	
  /**
   * @swagger
   * /form:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista formulario
   *     description: obtiene vista formulario
   */
	//@route('/form')
	//@method(['get'])
	renderForm: function(req,res){
		controlador.renderForm(req,res);
	},
	
  /**
   * @swagger
   * /login:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista login
   *     description: obtiene vista login
   */
	//@route('/login')
	//@method(['get'])
	renderLogin: function(req,res){
		controlador.renderLogin(req,res);
	},
		
  /**
   * @swagger
   * /forget:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista forget
   *     description: obtiene vista forget
   */
	//@route('/forget')
	//@method(['get'])
	renderForget: function(req,res){
		controlador.renderForget(req,res);
	},

  /**
   * @swagger
   * /recovery:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista recovery
   *     description: obtiene vista recovery
   */
	//@route('/recovery')
	//@method(['get'])
	renderRecovery: function(req,res){
		controlador.renderRecovery(req,res);
	},
	
  /**
   * @swagger
   * /politicas-de-privacidad:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista politicas-de-privacidad
   *     description: obtiene vista politicas-de-privacidad
   */
	//@route('/politicas-de-privacidad')
	//@method(['get'])
	renderPoliticasPrivacidad: function(req,res){
		controlador.renderPoliticasPrivacidad(req,res);
	},
	
  /**
   * @swagger
   * /condiciones-del-servicio:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista condiciones-del-servicio
   *     description: obtiene vista condiciones-del-servicio
   */
	//@route('/condiciones-del-servicio')
	//@method(['get'])
	renderCondicionesServicio: function(req,res){
		controlador.renderCondicionesServicio(req,res);
	},
	
  /**
   * @swagger
   * /admin/admin:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista del administrador
   *     description: obtiene vista del administrador
   */
	//@route('/admin/admin')
	//@method(['get'])
	//@roles(['root','admin'])
	renderAdmin: function(req,res){
		controlador.renderAdmin(req,res);
	},
	
  /**
   * @swagger
   * /form-admin:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista de formulario del administrador
   *     description: obtiene vista formulario del administrador
   */
	//@route('/form-admin')
	//@method(['get'])
	renderFormAdmin: function(req,res){
		controlador.renderFormAdmin(req,res);
	}
	
}