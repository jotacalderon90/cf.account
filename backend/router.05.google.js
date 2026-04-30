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
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/account/googleoauth')
  //@method(['get'])
  googleoauth: controlador.googleoauth,

  /**
   * @swagger
   * /api/account/googleoauth/callback:
   *   get:
   *     tags:
   *       - Google
   *     summary: Servicio de retorno al hacer login exitoso con google
   *     description: Servicio de retorno al hacer login exitoso con google
   *     parameters:
   *       - in: query
   *         name: code
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
  //@route('/api/account/googleoauth/callback')
  //@method(['get'])
  googleoauthcallback: controlador.googleoauthcallback,

  /**
   * @swagger
   * /api/google/send:
   *   get:
   *     tags:
   *       - Google
   *     summary: Servicio de prueba para enviar correo
   *     description: Servicio de prueba para enviar correo
   *     x-roles: ['root']
   *     parameters:
   *       - in: query
   *         name: raw
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
  //@route('/api/google/send')
  //@method(['get'])
  //@roles(['root'])
  send: controlador.send,
};
