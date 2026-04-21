'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

module.exports = {

  create: async function (req, res) {
    try {

      const parseResult = validator.create.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.create(parseResult.data);

      if (respuesta === true) {
        response.APISuccess(res);
      } else {
        logger.error(respuesta);
        response.APIError(req, res, respuesta);
      }
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.rolesCreate + ' ' + constants.error.controlador);
    }
  },

  read: async function (req, res) {
    try {
      const respuesta = await service.read(req.params.id);
      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.rolesRead + ' ' + constants.error.controlador);
    }
  },

  update: async function (req, res) {
    try {
      const parseResult = validator.update.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.update(parseResult.data, req.params.id);

      if (respuesta === true) {
        response.APISuccess(res);
      } else {
        logger.error(respuesta);
        response.APIError(req, res, respuesta);
      }
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.rolesUpdate + ' ' + constants.error.controlador);
    }
  },

  delete: async function (req, res) {
    try {
      await service.delete(req.params.id);
      response.APISuccess(res);
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.rolesDelete + ' ' + constants.error.controlador);
    }
  },

  collection: async function (req, res) {
    try {
      const data = await service.collection();
      res.send({ data: data });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.rolesFind + ' ' + constants.error.controlador);
    }
  }

};
