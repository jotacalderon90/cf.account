'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
//const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  mailingSubscritos: async function (req, res) {
    try {
      /*const parseResult = validator.mailingSubscritos.safeParse();

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }*/

      const respuesta = await service.mailingSubscritos({
        //...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error, req.headers.host);
      response.APIError(
        req,
        res,
        constants.error.rest.mailingSubscritos + ' ' + constants.error.controlador
      );
    }
  },
};
