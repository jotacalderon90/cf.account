'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const hooks = require('../hooks');
const password = require('../password');
const googleOauth2 = require('../google.oauth2');

const { user } = require('../_repository/_');

module.exports = {
  googleoauthcallback: async function (input) {
    try {
      
      const registro = await googleOauth2.getUserInfo(input.domain, input.code);

      if(registro === null) {
        throw new Error(constants.error.rest.googleoauthcallbackNotFound + ' para domain ' + input.domain);
      }

      const email = registro.email;

      const userByEmail = await user.findByEmail(email, input.domain);
      
      const hash = password.random();
      
      if (userByEmail === null) {
        const nuevoUsuario = {};
        nuevoUsuario.email = email;
        nuevoUsuario.password = '';
        nuevoUsuario.roles = ['user'];
        nuevoUsuario.hash = hash;
        nuevoUsuario.activate = true;
        nuevoUsuario.notification = true;
        nuevoUsuario.nickname = registro.name;
        nuevoUsuario.thumb = registro.picture;
        nuevoUsuario.host = input.domain;
        
        nuevoUsuario.google = registro;

        const created = await user.create(nuevoUsuario);
        logger.info(created);

      } else {
        const usuarioActualizar = {};
        ((usuarioActualizar.thumb = registro.picture), (usuarioActualizar.google = registro));
        usuarioActualizar.hash = hash;
        
        const updated = await user.update(userByEmail.id, usuarioActualizar);
        logger.info(updated);

      }

      hooks.pushOnLogin(email);

      return { hash, email };
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.googleoauthcallback + ' ' + constants.error.servicio);
    }
  }
};
