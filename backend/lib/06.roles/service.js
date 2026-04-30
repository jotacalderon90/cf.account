'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const constants = require('./constants');
const repository = require('./repository');

module.exports = {
  create: async function (input) {
    try {
      const result = await repository.create(input);
      logger.info(result);
      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.rolesCreate + ' ' + constants.error.servicio
      );
    }
  },

  read: async function (id) {
    try {
      const rol = await repository.read(id);
      return rol;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.rolesRead + ' ' + constants.error.servicio
      );
    }
  },

  update: async function (input, id) {
    try {
      const updated = await repository.update(input, id);
      logger.info(updated);
      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.rolesUpdate + ' ' + constants.error.servicio
      );
    }
  },

  delete: async function (id) {
    try {
      const deleted = await repository.delete(id);
      logger.info(deleted);
      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.rolesDelete + ' ' + constants.error.servicio
      );
    }
  },

  collection: async function () {
    try {
      const roles = await repository.find({});
      return roles;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.rolesFind + ' ' + constants.error.servicio
      );
    }
  },

  total: async function () {
    try {
      const roles = await repository.total({});
      return roles;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.rolesTotal + ' ' + constants.error.servicio
      );
    }
  },
};
