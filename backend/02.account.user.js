'use strict';

const controlador = require('./lib/02.account.user/controller');

module.exports = {
	
  /**
   * @swagger
   * /api/account:
   *   post:
   *     tags:
   *       - Usuarios
   *     summary: Crear cuenta de usuario
   *     description: Crea una nueva cuenta de usuario, una vez logueado este servicio sirve para actualizar datos y eliminar cuenta
   */
	//@route('/api/account')
	//@method(['post'])
	create: async function(req,res){
    controlador.create(req,res);//internamente update+delete
	},
	
  /**
   * @swagger
   * /api/account:
   *   get:
   *     tags:
   *       - Usuarios
   *     summary: Obtener información de usuario logueado
   *     description: Obtiene la información de usuario logueado o null si no está logueado
   */
	//@route('/api/account')
	//@method(['get'])
	read: async function(req,res){
    controlador.read(req,res);
	},
		
  /**
   * @swagger
   * /api/account/activate/{hash}:
   *   get:
   *     tags:
   *       - Usuarios
   *     summary: Activar cuenta de usuario
   *     description: Activa una cuenta de usuario mediante el hash de activación enviado por correo
   */
	//@route('/api/account/activate/:hash')
	//@method(['get'])
	activate: function(req,res){
		controlador.activate(req,res);
	},
  
  /**
   * @swagger
   * /api/account/forget:
   *   post:
   *     tags:
   *       - Usuarios
   *     summary: Solicitar recuperación de contraseña
   *     description: Envía un correo con instrucciones para recuperar la contraseña olvidada
   */
	//@route('/api/account/forget')
	//@method(['post'])
	forget: async function(req,res){
		controlador.forget(req, res);
	},
	
  /**
   * @swagger
   * /api/account/recovery:
   *   post:
   *     tags:
   *       - Usuarios
   *     summary: Recuperar contraseña
   *     description: Restablece la contraseña usando el token de recuperación
   */
	//@route('/api/account/recovery')
	//@method(['post'])
	recovery: async function(req,res){
    controlador.recovery(req, res);
	},
  
  /**
   * @swagger
   * /api/account/login:
   *   post:
   *     tags:
   *       - Usuarios
   *     summary: Iniciar sesión
   *     description: Autentica a un usuario y crea una sesión     
   *     requestBody:
   *       content:
   *         application/json:
   *           example:
   *             email: usuario@ejemplo.com
   *             password: password123
   *             jwt: true
   */
	//@route('/api/account/login')
	//@method(['post'])
	login: async function(req,res){
		controlador.login(req,res);
	},
	
  /**
   * @swagger
   * /api/account/logout:
   *   get:
   *     tags:
   *       - Usuarios
   *     summary: Cerrar sesión
   *     description: Cierra la sesión del usuario actual
   */
	//@route('/api/account/logout')
	//@method(['get'])
	logout: async function(req,res){
		controlador.logout(req,res);
	},

}