'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const password = require('../password');
const hooks = require('../hooks');

const { user } = require('../_repository/_');

module.exports = {
  create: async function (input) {
    try {
      const nuevoUsuario = {};
      nuevoUsuario.email = input.email;
      nuevoUsuario.password = await password.hash(input.password);
      nuevoUsuario.roles = ['user'];
      nuevoUsuario.hash = password.random();
      nuevoUsuario.activate = process.env.HOST_MAILING ? false : true;
      nuevoUsuario.notification = true;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';

      const created = await user.create(nuevoUsuario);

      if (created === constants.error.rest.createEmailExiste) {
        return constants.error.rest.createEmailExiste;
      }

      hooks.pushOnCreate(nuevoUsuario.email);

      hooks.mailingOnCreate(
        nuevoUsuario.email,
        Buffer.from(nuevoUsuario.hash, 'utf8').toString('base64')
      );

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },

  read: async function (id) {
    try {
      console.log(id);
      const registro = await user.findByHash(id);
      console.log(registro);
      if (registro == null) {
      }

      if (!registro.activate) {
        logger.error(constants.error.rest.login_desactivate + ' - ' + registro.email);
        return null;
      }

      return registro;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },

  update: async function (input, registro) {
    try {
      //validaciones de negocio para password
      let redirect = '/';
      if (input.password != registro.password) {
        input.password = await password.hash(input.password);
        redirect = '/api/account/logout';
      }

      await user.update(input, registro.id);

      return redirect;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.servicio);
    }
  },

  delete: async function (id) {
    try {
      await user.delete(id);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.servicio);
    }
  },

  activate: async function (input) {
    try {
      const users = await user.collection({
        hash: Buffer.from(input.hash, 'base64').toString('utf8'),
      });

      if (users.length != 1) {
        return 'No se encontró usuario';
      }

      await user.update({ activate: true }, users[0].id);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.activate + ' ' + constants.error.servicio);
    }
  },

  forget: async function (input) {
    try {
      const userByEmail = await user.findByEmail(input.email);

      if (userByEmail === null) {
        return 'No se encontró usuario';
      }

      const newhash = password.random();
      await user.update({ hash: newhash }, userByEmail.id);

      hooks.mailingOnForget(userByEmail.email, Buffer.from(newhash, 'utf8').toString('base64'));

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.forget + ' ' + constants.error.servicio);
    }
  },

  recovery: async function (input) {
    try {
      const users = await user.collection({
        hash: Buffer.from(input.hash, 'base64').toString('utf8'),
      });

      if (users.length != 1) {
        throw new Error(constants.error.rest.forgetNoUser);
      }

      const registro = users[0];

      const nuevosDatos = {
        hash: '',
        password: await password.hash(input.password),
      };

      await user.update(nuevosDatos, registro.id);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.recovery + ' ' + constants.error.servicio);
    }
  },

  login: async function (input) {
    try {
      const userByEmail = await user.findByEmail(input.email);

      if (userByEmail === null) {
        return 'No se encontró usuario';
      }

      if (!userByEmail.activate) {
        return 'Usuario ha sido desactivado :S xd';
      }

      const isValidPassword = await password.verify(input.password, userByEmail.password);

      if (!isValidPassword) {
        return 'Los datos ingresados no corresponden .2';
      }

      const nuevosDatos = {
        hash: await password.random(),
      };

      await user.update(nuevosDatos, userByEmail.id);
      userByEmail.hash = nuevosDatos.hash;

      hooks.pushOnLogin(input.email);

      return userByEmail;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.login + ' ' + constants.error.servicio);
    }
  },

  logout: async function (input) {
    try {
      const nuevosDatos = {
        hash: '',
      };

      await user.update(nuevosDatos, input.id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.login + ' ' + constants.error.servicio);
    }
  },
};
