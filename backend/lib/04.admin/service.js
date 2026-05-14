'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const redis = require('cl.jotacalderon.cf.framework/lib/redis');

const constants = require('./constants');

const hooks = require('../hooks');
const password = require('../password');

const { user } = require('../_repository/_');

module.exports = {
  tracking: async function (host) {
    try {
      const sessions = [];

      if (process.env.REDIS_HOST) {
        const keys = await redis.keys();

        for (const key of keys) {
          const data = await redis.get(key);
          if (data && data.host === host) {
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
      const query = {
        host: input.host,
      };

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
      const userByEmail = await user.findByEmail(input.email, input.host);

      if (userByEmail != null) {
        return constants.error.rest.createadminexists;
      }

      const nuevoUsuario = {};
      nuevoUsuario.host = input.host;
      nuevoUsuario.email = input.email;
      nuevoUsuario.password = await password.hash(input.password);
      nuevoUsuario.roles = ['admin'];
      nuevoUsuario.hash = password.random(24);
      nuevoUsuario.activate = true;
      nuevoUsuario.notification = true;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';

      await user.create(nuevoUsuario);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.createadmin + ' ' + constants.error.servicio);
    }
  },

  createbyadmin: async function (input) {
    try {
      const userByEmail = await user.findByEmail(input.email, input.host);

      if (userByEmail != null) {
        return constants.error.rest.createadminexists;
      }

      const nuevoUsuario = {};
      nuevoUsuario.host = input.host;
      nuevoUsuario.email = input.email;
      nuevoUsuario.password = await password.hash(input.password);
      nuevoUsuario.roles = ['user'];
      nuevoUsuario.hash = password.random(24);
      nuevoUsuario.activate = true;
      nuevoUsuario.notification = true;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';

      const created = await user.create(nuevoUsuario);
      logger.info(created);

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.createbyadmin + ' ' + constants.error.servicio);
    }
  },

  updatebyadmin_roles: async function (input, id) {
    try {
      //validar usuario a modificar por dominio y revalidar id obtenido
      //sin esto, un root de un dominio podria modificar usuarios de otro dominio
      const userInHost = await user.inHost(id, input.host);
      if (!userInHost) {
        throw new Error(constants.error.rest.updatebyadmin_userinhost);
      }

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
      console.log(input, id);
      //validar usuario a modificar por dominio y revalidar id obtenido
      //sin esto, un root de un dominio podria modificar usuarios de otro dominio
      const userInHost = await user.inHost(id, input.host);

      if (!userInHost) {
        throw new Error(constants.error.rest.updatebyadmin_userinhost);
      }

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
      //validar usuario a modificar por dominio y revalidar id obtenido
      //sin esto, un root de un dominio podria modificar usuarios de otro dominio
      const userInHost = await user.inHost(id, input.host);
      if (!userInHost) {
        throw new Error(constants.error.rest.updatebyadmin_userinhost);
      }

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
      //validar usuario a modificar por dominio y revalidar id obtenido
      //sin esto, un root de un dominio podria modificar usuarios de otro dominio
      const userInHost = await user.inHost(id, input.host);
      if (!userInHost) {
        throw new Error(constants.error.rest.updatebyadmin_userinhost);
      }

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
      //validar usuario a modificar por dominio y revalidar id obtenido
      //sin esto, un root de un dominio podria modificar usuarios de otro dominio
      const userInHost = await user.inHost(input.id, input.host);
      if (!userInHost) {
        throw new Error(constants.error.rest.updatebyadmin_userinhost);
      }

      return await user.delete(input.id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.deletebyadmin + ' ' + constants.error.servicio);
    }
  },
};
