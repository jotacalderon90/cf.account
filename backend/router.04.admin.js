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
   *     x-roles: ['admin']
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
  //@roles(['admin'])
  tracking: controlador.tracking,

  /**
   * @swagger
   * /api/admin/account/total:
   *   get:
   *     tags:
   *       - Administrador
   *     summary: Contar total de usuarios
   *     description: Obtiene el número total de usuarios registrados
   *     x-roles: ['admin']
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
  //@roles(['admin'])
  total: controlador.total,

  /**
   * @swagger
   * /api/admin/account/collection:
   *   get:
   *     tags:
   *       - Administrador
   *     summary: Obtener colección de usuarios
   *     description: Obtiene la lista completa de usuarios con sus datos
   *     x-roles: ['admin']
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
  //@roles(['admin'])
  collection: controlador.collection,

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
  createadmin: controlador.createadmin,

  /**
   * @swagger
   * /api/admin/account:
   *   post:
   *     tags:
   *       - Administrador
   *     summary: Crear usuario por administrador
   *     description: Permite a un administrador crear una nueva cuenta de usuario
   *     x-roles: ['admin']
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
  //@roles(['admin'])
  createbyadmin: controlador.createbyadmin,

  /**
   * @swagger
   * /api/admin/account/{id}:
   *   put:
   *     tags:
   *       - Administrador
   *     summary: Actualizar usuario por administrador
   *     description: Permite a un administrador actualizar los datos de un usuario existente
   *     x-roles: ['admin']
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
  //@roles(['admin'])
  updatebyadmin: controlador.updatebyadmin,

  /**
   * @swagger
   * /api/admin/account/{id}:
   *   delete:
   *     tags:
   *       - Administrador
   *     summary: Eliminar usuario por administrador
   *     description: Permite a un administrador eliminar una cuenta de usuario
   *     x-roles: ['admin']
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
  //@roles(['admin'])
  deletebyadmin: controlador.deletebyadmin,
};
