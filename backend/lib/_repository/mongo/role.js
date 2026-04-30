'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

const constants = require('../../constants');

module.exports = {
  create: async function (input) {
    try {
      const created = await mongodb.insertOne('roles', input);
      return created;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.rolesCreate + ' ' + constants.error.repositorio);
    }
  },

  read: async function (id) {
    try {
      const rol = await mongodb.findOne('roles', id);
      return rol;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.rolesRead + ' ' + constants.error.repositorio);
    }
  },

  update: async function (input, id) {
    try {
      const updated = await mongodb.updateOne('roles', id, { $set: input });
      return updated;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.rolesUpdate + ' ' + constants.error.repositorio);
    }
  },

  delete: async function (id) {
    try {
      const deleted = await mongodb.deleteOne('roles', id);
      return deleted;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.rolesDelete + ' ' + constants.error.repositorio);
    }
  },

  find: async function (query, options) {
    try {
      const roles = await mongodb.find('roles', query, options);
      return roles;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.rolesFind + ' ' + constants.error.repositorio);
    }
  },

  total: async function (query, options) {
    try {
      const total = await mongodb.count('roles', query, options);
      return total;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.rolesTotal + ' ' + constants.error.repositorio);
    }
  },
};
