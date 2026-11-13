'use strict';

const controlador = require('./lib/09.microsoft/controller');

module.exports = {

  /**
   * @swagger
   * /api/account/microsoftauth/callback:
   *   get:
   *     tags:
   *       - Microsoft
   *     summary: Servicio de retorno al hacer login con mocrosoft
   *     description: Servicio de retorno al hacer login con mocrosoft
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
  //@route('/api/account/microsoftauth/callback')
  //@method(['get'])
  microsoftoauthcallback: controlador.microsoftoauthcallback,

};
