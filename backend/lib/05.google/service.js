'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const hooks = require('../hooks');
const password = require('../password');
const googleapis = require('../googleapis');

const { user } = require('../_repository/_');

module.exports = {
  googleoauth: async function () {
    try {
      return googleapis.getURL();
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.googleoauth + ' ' + constants.error.servicio);
    }
  },

  googleoauthcallback: async function (input) {
    try {
      const registro = await googleapis.getUserInfo(input.code);

      const email = registro.email;

      const userByEmail = await user.findByEmail(email);

      let respuesta;

      let id;

      if (userByEmail === null) {
        const nuevoUsuario = {};
        nuevoUsuario.email = email;
        nuevoUsuario.password = '';
        nuevoUsuario.roles = ['user'];
        nuevoUsuario.hash = password.random(24);
        nuevoUsuario.activate = true;
        nuevoUsuario.notification = true;
        nuevoUsuario.nickname = registro.name;
        nuevoUsuario.thumb = registro.picture;

        respuesta = await user.create(nuevoUsuario);

        id = respuesta;
      } else {
        const usuarioActualizar = {};
        ((usuarioActualizar.thumb = registro.picture), (usuarioActualizar.google = registro));

        respuesta = await user.update(userByEmail.id, usuarioActualizar);

        id = userByEmail.id;
      }

      hooks.pushOnLogin(email);

      return { id, email };
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.googleoauthcallback + ' ' + constants.error.servicio);
    }
  },

  send: async function (input) {
    try {
      return await googleapis.sendMemo(input.tokens, input.raw);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.send + ' ' + constants.error.servicio);
    }
  },
};
