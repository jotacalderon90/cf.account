/*
20260825:servicios para permitir al usuario desubscribirse a las notificaciones por correo
*/

'use strict';

const controlador = require('./lib/08.unsubscribe/controller');

module.exports = {
  /**
   * @swagger
   * /unsubscribe/{hash}:
   *   get:
   *     tags:
   *       - Usuarios
   *     summary: desactivar notificaciones por correo de un usuario
   *     description: desactivar notificaciones por correo de un usuario
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/unsubscribe/:hash')
  //@method(['get'])
  unsubscribe: controlador.unsubscribe,
};
