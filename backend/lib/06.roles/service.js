'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const { role } = require('../_repository/_');

module.exports = {
  total: async function () {
    try {
      return await role.total();
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.servicio);
    }
  },

  collection: async function () {
    try {
      return await role.collection({});
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

  read: async function (id) {
    try {
      return await role.read(id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },

  update: async function (input, id) {
    try {
      return await role.update(input, id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.servicio);
    }
  },

  delete: async function (id) {
    try {
      return await role.delete(id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.servicio);
    }
  },
};
