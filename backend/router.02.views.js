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
  //@roles(['root','admin','user'])
  renderIndex: function (req, res) {
    controlador.renderIndex(req, res);
  },

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
  renderForm: function (req, res) {
    controlador.renderForm(req, res);
  },

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
  renderLogin: function (req, res) {
    controlador.renderLogin(req, res);
  },

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
  renderForget: function (req, res) {
    controlador.renderForget(req, res);
  },

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
  renderRecovery: function (req, res) {
    controlador.renderRecovery(req, res);
  },

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
  renderPoliticasPrivacidad: function (req, res) {
    controlador.renderPoliticasPrivacidad(req, res);
  },

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
  renderCondicionesServicio: function (req, res) {
    controlador.renderCondicionesServicio(req, res);
  },

  /**
   * @swagger
   * /admin/admin:
   *   get:
   *     tags:
   *       - Vistas
   *     summary: obtener vista del administrador
   *     description: obtiene vista del administrador
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/admin/admin')
  //@method(['get'])
  //@roles(['root','admin'])
  renderAdmin: function (req, res) {
    controlador.renderAdmin(req, res);
  },

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
  renderFormAdmin: function (req, res) {
    controlador.renderFormAdmin(req, res);
  }

}