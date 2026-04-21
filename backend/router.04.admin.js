'use strict';

const controlador = require('./lib/04.admin/controller');

module.exports = {
	
  /**
   * @swagger
   * /api/admin/account/tracking:
   *   get:
   *     tags:
   *       - Administrador
   *     summary: Obtener seguimiento de usuarios
   *     description: Obtiene información de seguimiento y actividad de usuarios (solo root)
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     parameters:
   *       - in: query
   *         name: roles
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     parameters:
   *       - in: query
   *         name: roles
   *         schema:
   *           type: string
   *       - in: query
   *         name: skip
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               roles:
   *                 type: array
   *                 items:
   *                   type: string
   *               activate:
   *                 type: boolean
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
	//@route('/api/admin/account/:id')
	//@method(['delete'])
	//@roles(['root','admin'])
	deletebyadmin: async function(req,res){
		controlador.deletebyadmin(req, res);
	}
	
}