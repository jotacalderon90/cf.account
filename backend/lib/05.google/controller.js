'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const session = require('../session');
const jwt = require('../jwt');
const domain = require('../domain');

module.exports = {
  googleoauthcallback: async function (req, res) {
    try {
      const parseResult = validator.googleoauthcallback.safeParse(req.query);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const userLogged = await service.googleoauthcallback({
        ...parseResult.data,
        domain: domain.getParentDomain(req.headers.host)
      });

      const token = jwt.encode(userLogged.hash);
      
      session.create(req, res, token, userLogged.email, domain.getParentDomain(req.headers.host));

      res.redirect('/');
    } catch (error) {
      logger.error(error, req.headers.host);
      response.renderError(
        req,
        res,
        constants.error.rest.googleoauthcallback + ' ' + constants.error.controlador
      );
    }
  },

};
