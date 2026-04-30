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
   *     x-roles: ['root']
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
  collection: controlador.collection,

  /**
   * @swagger
   * /api/admin/roles/total:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Obtener total de roles
   *     description: Obtiene total de roles
   *     x-roles: ['root']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/admin/roles/total')
  //@method(['get'])
  //@roles(['root'])
  total: controlador.total,

  /**
   * @swagger
   * /api/admin/roles:
   *   post:
   *     tags:
   *       - Roles
   *     summary: Crear rol
   *     description: Crea un nuevo rol
   *     x-roles: ['root']
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
  create: controlador.create,

  /**
   * @swagger
   * /api/admin/roles/{id}:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Obtener rol
   *     description: Obtiene la información de un rol
   *     x-roles: ['root']
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
  read: controlador.read,

  /**
   * @swagger
   * /api/admin/roles/{id}:
   *   put:
   *     tags:
   *       - Roles
   *     summary: Actualizar rol
   *     description: Actualiza un rol
   *     x-roles: ['root']
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
  update: controlador.update,

  /**
   * @swagger
   * /api/admin/roles/{id}:
   *   delete:
   *     tags:
   *       - Roles
   *     summary: Eliminar rol
   *     description: Elimina un rol
   *     x-roles: ['root']
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
  delete: controlador.delete,
};
