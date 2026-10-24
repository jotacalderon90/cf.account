'use strict';

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
   *     x-roles: ['root', 'admin','user']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/')
  //@method(['get'])
  //@roles(['root', 'admin','user'])
  renderIndex: controlador.renderIndex,

  /**
   * @swagger
   * /form:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista formulario
   *     description: obtiene vista formulario
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/form')
  //@method(['get'])
  renderForm: controlador.renderForm,

  /**
   * @swagger
   * /login:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista login
   *     description: obtiene vista login
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/login')
  //@method(['get'])
  renderLogin: controlador.renderLogin,

  /**
   * @swagger
   * /forget:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista forget
   *     description: obtiene vista forget
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/forget')
  //@method(['get'])
  renderForget: controlador.renderForget,

  /**
   * @swagger
   * /recovery:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista recovery
   *     description: obtiene vista recovery
   *     parameters:
   *       - in: query
   *         name: hash
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/recovery')
  //@method(['get'])
  renderRecovery: controlador.renderRecovery,

  /**
   * @swagger
   * /politicas-de-privacidad:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista politicas-de-privacidad
   *     description: obtiene vista politicas-de-privacidad
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/politicas-de-privacidad')
  //@method(['get'])
  renderPoliticasPrivacidad: controlador.renderPoliticasPrivacidad,

  /**
   * @swagger
   * /condiciones-del-servicio:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista condiciones-del-servicio
   *     description: obtiene vista condiciones-del-servicio
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/condiciones-del-servicio')
  //@method(['get'])
  renderCondicionesServicio: controlador.renderCondicionesServicio,

  /**
   * @swagger
   * /admin/roles:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista de administración de roles
   *     description: obtiene vista de administración de roles
   *     x-roles: ['root', 'admin']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/admin/roles')
  //@method(['get'])
  //@roles(['root', 'admin'])
  renderAdminRoles: controlador.renderAdminRoles,

  /**
   * @swagger
   * /admin/users:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista de administración de usuarios
   *     description: obtiene vista de administración de usuarios
   *     x-roles: ['root', 'admin']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/admin/users')
  //@method(['get'])
  //@roles(['root', 'admin'])
  renderAdminUsers: controlador.renderAdminUsers,

  /**
   * @swagger
   * /form-admin:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista de formulario del administrador
   *     description: obtiene vista formulario del administrador
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/form-admin')
  //@method(['get'])
  renderFormAdmin: controlador.renderFormAdmin,
};
