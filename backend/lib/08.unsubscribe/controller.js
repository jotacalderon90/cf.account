'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  unsubscribe: async function (req, res) {
    try {
      const parseResult = validator.unsubscribe.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const unsubscribe = await service.unsubscribe({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      if (typeof unsubscribe === 'string') {
        throw new Error(unsubscribe);
      }

      response.renderMessage(
        req,
        res,
        200,
        ':(',
        'Se ha eliminado su subscripción de manera correcta',
        'success'
      );
    } catch (error) {
      logger.error(error, req.headers.host);
      response.renderError(
        req,
        res,
        constants.error.rest.unsubscribe + ' ' + constants.error.controlador
      );
    }
  },
};
