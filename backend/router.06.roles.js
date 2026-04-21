'use strict';

const controlador = require('./lib/06.roles/controller');

module.exports = {
	
  /**
   * @swagger
   * /api/admin/roles/collection:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Obtener colección de roles
   *     description: Obtiene la lista completa de roles
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
	//@route('/api/admin/roles/collection')
	//@method(['get'])
	//@roles(['root'])
	collection: async function(req,res){
		controlador.collection(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/roles:
   *   post:
   *     tags:
   *       - Roles
   *     summary: Crear rol
   *     description: Crea un nuevo rol
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *               descripcion:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
	//@route('/api/admin/roles')
	//@method(['post'])
	//@roles(['root'])
	create: async function(req,res){
		controlador.create(req,res);
	},
	
  /**
   * @swagger
   * /api/admin/roles/{id}:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Obtener rol
   *     description: Obtiene la información de un rol
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
	//@route('/api/admin/roles/:id')
	//@method(['get'])
	//@roles(['root'])
	read: async function(req,res){
		controlador.read(req,res);
	},
		
  /**
   * @swagger
   * /api/admin/roles/{id}:
   *   put:
   *     tags:
   *       - Roles
   *     summary: Actualizar rol
   *     description: Actualiza un rol
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
   *               nombre:
   *                 type: string
   *               descripcion:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
	//@route('/api/admin/roles/:id')
	//@method(['put'])
	//@roles(['root'])
	update: async function(req,res){
		controlador.update(req,res);
	},
  
  /**
   * @swagger
   * /api/admin/roles/{id}:
   *   delete:
   *     tags:
   *       - Roles
   *     summary: Eliminar rol
   *     description: Elimina un rol
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
	//@route('/api/admin/roles/:id')
	//@method(['delete'])
	//@roles(['root'])
	delete: async function(req,res){
		controlador.delete(req, res);
	}
}
