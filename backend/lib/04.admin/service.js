'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const redis = require('cl.jotacalderon.cf.framework/lib/redis');

const constants = require('./constants');

const hooks = require('../hooks');
const password = require('../password');

const { user } = require('../_repository/_');

module.exports = {
  tracking: async function () {
    try {
      const sessions = [];

      if (process.env.REDIS_HOST) {
        const keys = await redis.keys();

        for (const key of keys) {
          const data = await redis.get(key);
          if (data) {
            sessions.push(data);
          }
        }
      }

      return sessions;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.tracking + ' ' + constants.error.servicio);
    }
  },

  total: async function (input) {
    try {
      const query = {};

      if (input.roles) {
        query.roles = input.roles;
      }

      const respuesta = await user.total(query);

      return respuesta;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.servicio);
    }
  },

  collection: async function (input) {
    try {
      return await user.findToTablePaginator(input);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },

  createadmin: async function (input) {
    try {
      const userByEmail = await user.findByEmail(input.email);

      if (userByEmail != null) {
        return 'email ingresado ya existe';
      }

      const nuevoUsuario = {};
      nuevoUsuario.email = input.email;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.password = await password.hash(input.password);
      nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';
      nuevoUsuario.activate = true;
      nuevoUsuario.roles = ['root'];

      return await user.create(nuevoUsuario);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.createadmin + ' ' + constants.error.servicio);
    }
  },

  createbyadmin: async function (input) {
    try {
      const userByEmail = await user.findByEmail(input.email);

      if (userByEmail != null) {
        return 'email ingresado ya existe';
      }

      const nuevoUsuario = {};
      nuevoUsuario.email = input.email;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.password = await password.hash(input.password);
      nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';
      nuevoUsuario.activate = true;
      nuevoUsuario.roles = ['user'];

      return await user.create(nuevoUsuario);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.createbyadmin + ' ' + constants.error.servicio);
    }
  },

  updatebyadmin_roles: async function (input, id) {
    try {
      const respuesta = await user.update(input, id);
      logger.info(respuesta);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },

  updatebyadmin_activate: async function (input, id) {
    try {
      const respuesta = await user.update(input, id);
      logger.info(respuesta);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },

  updatebyadmin_password: async function (input, id) {
    try {
      const respuesta = await user.update({ password: await password.hash(input.password) }, id);
      logger.info(respuesta);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },

  updatebyadmin_notify: async function (input, id) {
    try {
      const registro = await user.read(id);
      const hash = Buffer.from(registro.password, 'utf8').toString('base64');

      hooks.mailingOnForget(registro.email, hash);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },

  deletebyadmin: async function (input) {
    try {
      return await user.delete(input.id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.deletebyadmin + ' ' + constants.error.servicio);
    }
  },
};
