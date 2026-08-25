/*
20260824:servicios expuestos para otros sistemas
caso 1° desde mailing saber usuarios subscritos para mailing
*/

'use strict';

const controlador = require('./lib/07.external/controller');

module.exports = {
  /**
   * @swagger
   * /api/mailing/subscritos:
   *   get:
   *     tags:
   *       - External
   *     summary: Obtener mail de usuarios subscritos
   *     description: Obtiene mail de usuarios subscritos
   *     x-roles: ['root', 'admin', 'mailing']
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/mailing/subscritos')
  //@method(['get'])
  //@roles(['root', 'admin', 'mailing'])
  mailingSubscritos: controlador.mailingSubscritos,
};
