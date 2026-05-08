'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const { role } = require('../_repository/_');

module.exports = {
  total: async function (host) {
    try {
      return await role.total({ host: host });
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.servicio);
    }
  },

  collection: async function (host) {
    try {
      return await role.collection({ host: host });
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },

  create: async function (input) {
    try {
      return await role.create(input);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },

  read: async function (input) {
    try {
      const doc = await role.read(input.id);
      if (doc && doc.host === input.host) {
        return doc;
      }
      throw new Error(constants.error.rest.read_inhost);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },

  update: async function (input, id) {
    try {
      const doc = await role.read(id);
      if (doc && doc.host === input.host) {
        return await role.update(input, id);
      }
      throw new Error(constants.error.rest.read_inhost);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.servicio);
    }
  },

  delete: async function (input) {
    try {
      const doc = await role.read(input.id);
      if (doc && doc.host === input.host) {
        return await role.delete(input.id);
      }
      throw new Error(constants.error.rest.read_inhost);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.servicio);
    }
  },
};
