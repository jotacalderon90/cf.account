'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  total: async function (req, res) {
    try {
      const data = await service.total(domain(req.headers.host));

      res.send({ data: data });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.total + ' ' + constants.error.controlador);
    }
  },

  collection: async function (req, res) {
    try {
      const data = await service.collection(domain(req.headers.host));

      res.send({ data: data });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.collection + ' ' + constants.error.controlador
      );
    }
  },

  create: async function (req, res) {
    try {
      const parseResult = validator.create.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      await service.create({
        ...parseResult.data,
        host: domain(req.headers.host),
      });

      response.APISuccess(res);
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.create + ' ' + constants.error.controlador);
    }
  },

  read: async function (req, res) {
    try {
      const respuesta = await service.read({
        id: req.params.id,
        host: domain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.read + ' ' + constants.error.controlador);
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

      await service.update(
        {
          ...parseResult.data,
          host: domain(req.headers.host),
        },
        req.params.id
      );

      response.APISuccess(res);
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.update + ' ' + constants.error.controlador);
    }
  },

  delete: async function (req, res) {
    try {
      await service.delete({
        id: req.params.id,
        host: domain(req.headers.host),
      });

      response.APISuccess(res);
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.delete + ' ' + constants.error.controlador);
    }
  },
};
