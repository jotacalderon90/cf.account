'use strict';

const controlador = require('./lib/04.account.admin/controller');

module.exports = {
	
  /**
   * @swagger
   * /api/admin/account/tracking:
   *   get:
   *     tags:
   *       - Administrador
   *     summary: Obtener seguimiento de usuarios
   *     description: Obtiene información de seguimiento y actividad de usuarios (solo root)
   */
	//@route('/api/admin/account/tracking')
	//@method(['get'])
	//@roles(['root'])
  tracking: async function(req, res) {
    controlador.tracking(req, res);
  },
  
  /**
   * @swagger
   * /api/admin/account/total:
   *   get:
   *     tags:
   *       - Administrador
   *     summary: Contar total de usuarios
   *     description: Obtiene el número total de usuarios registrados
   */
	//@route('/api/admin/account/total')
	//@method(['get'])
	//@roles(['root','admin'])
	count: async function(req,res){
    controlador.count(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/account/collection:
   *   get:
   *     tags:
   *       - Administrador
   *     summary: Obtener colección de usuarios
   *     description: Obtiene la lista completa de usuarios con sus datos
   */
	//@route('/api/admin/account/collection')
	//@method(['get'])
	//@roles(['root','admin'])
	collection: async function(req,res){
		controlador.collection(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/account/tag/collection:
   *   get:
   *     tags:
   *       - Administrador
   *     summary: Obtener colección de etiquetas
   *     description: Obtiene la lista de etiquetas asociadas a usuarios
   */
	//@route('/api/admin/account/tag/collection')
	//@method(['get'])
	//@roles(['root','admin'])
	tag: async function(req,res){
		controlador.tag(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/account/createadmin:
   *   post:
   *     tags:
   *       - Administrador
   *     summary: Crear cuenta de administrador
   *     description: Crea una nueva cuenta con permisos de administrador
   */
	//@route('/api/admin/account/createadmin')
	//@method(['post'])
	createadmin: async function(req,res){
		controlador.createadmin(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/account:
   *   post:
   *     tags:
   *       - Administrador
   *     summary: Crear usuario por administrador
   *     description: Permite a un administrador crear una nueva cuenta de usuario
   */
	//@route('/api/admin/account')
	//@method(['post'])
	//@roles(['root','admin'])
	createbyadmin: async function(req,res){
		controlador.createbyadmin(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/account/{id}:
   *   put:
   *     tags:
   *       - Administrador
   *     summary: Actualizar usuario por administrador
   *     description: Permite a un administrador actualizar los datos de un usuario existente
   */
	//@route('/api/admin/account/:id')
	//@method(['put'])
	//@roles(['root','admin'])
	updatebyadmin: async function(req,res){
		controlador.updatebyadmin(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/account/{id}:
   *   delete:
   *     tags:
   *       - Administrador
   *     summary: Eliminar usuario por administrador
   *     description: Permite a un administrador eliminar una cuenta de usuario
   */
	//@route('/api/admin/account/:id')
	//@method(['delete'])
	//@roles(['root','admin'])
	deletebyadmin: async function(req,res){
		controlador.deletebyadmin(req, res);
	}
	
}