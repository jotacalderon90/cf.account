'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const hooks = require('../hooks');
const googleapis = require('../googleapis');

const { user } = require('../_repository/_');

module.exports = {
  googleoauth: async function () {
    try {
      return googleapis.getURL();
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.googleoauth + ' ' + constants.error.servicio
      );
    }
  },

  googleoauthcallback: async function (input) {
    try {
      const registro = await googleapis.getUserInfo(input.code);

      const email = registro.emails[0].value;

      const users = await user.find({ email: email });

      let respuesta;

      let id;

      if (users.length === 0) {
        const nuevoUsuario = {};
        nuevoUsuario.email = email;
        nuevoUsuario.nickname = email;
        nuevoUsuario.thumb = registro.image.url;
        nuevoUsuario.activate = true;
        nuevoUsuario.roles = ['user'];

        respuesta = await user.create(nuevoUsuario);
        logger.info(respuesta);

        if (!respuesta.acknowledged) {
          throw new Error(respuesta);
        }

        id = respuesta.insertedId.toString();
      } else {
        const usuarioActualizar = {};
        ((usuarioActualizar.thumb = registro.image.url), (usuarioActualizar.google = registro));

        respuesta = await user.update(usuarioActualizar, users[0]._id);
        logger.info(respuesta);

        id = users[0]._id.toString();
      }

      hooks.pushOnLogin(email);

      return { _id: id, email: email };
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.googleoauthcallback + ' ' + constants.error.servicio
      );
    }
  },

  send: async function (input) {
    try {
      return await googleapis.sendMemo(input.tokens, input.raw);
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.send + ' ' + constants.error.servicio
      );
    }
  },
};
