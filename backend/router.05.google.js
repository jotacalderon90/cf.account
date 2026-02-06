'use strict';

const controlador = require('./lib/05.google/controller');

module.exports = {
	
  /**
   * @swagger
   * /api/account/googleoauth:
   *   get:
   *     tags:
   *       - Google
   *     summary: Obtiene link para oauth con google
   *     description: Obtiene link para oauth con google
   */
	//@route('/api/account/googleoauth')
	//@method(['get'])
	googleoauth: async function(req,res){
		controlador.googleoauth(req,res);
	},
  
  /**
   * @swagger
   * /api/account/googleoauth/callback:
   *   get:
   *     tags:
   *       - Google
   *     summary: Servicio de retorno al hacer login exitoso con google
   *     description: Servicio de retorno al hacer login exitoso con google
   */
	//@route('/api/account/googleoauth/callback')
	//@method(['get'])
  googleoauthcallback: async function(req,res){
		controlador.googleoauthcallback(req,res);
	},
	
  /**
   * @swagger
   * /api/google/send:
   *   get:
   *     tags:
   *       - Google
   *     summary: Servicio de prueba para enviar correo
   *     description: Servicio de prueba para enviar correo
   */
	//@route('/api/google/send')
	//@method(['get'])
	//@roles(['root'])
	send: async function(req,res){
    controlador.send(req,res);
	}
	
}