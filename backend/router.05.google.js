'use strict';

const controlador = require('./lib/05.google/controller');

module.exports = {

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

};
