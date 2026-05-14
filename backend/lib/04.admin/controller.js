'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  tracking: async function (req, res) {
    try {
      const respuesta = await service.tracking(domain(req.headers.host));

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.tracking + ' ' + constants.error.controlador
      );
    }
  },

  total: async function (req, res) {
    try {
      const parseResult = validator.total.safeParse(req.query);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.total({
        ...parseResult.data,
        host: domain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.total + ' ' + constants.error.controlador);
    }
  },

  collection: async function (req, res) {
    try {
      const parseResult = validator.collection.safeParse(req.query);

      if (!parseResult.success) {
        logger.error(parseResult);
        res.send({ error: constants.error.validacion });
        return;
      }

      const respuesta = await service.collection({
        ...parseResult.data,
        host: domain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.collection + ' ' + constants.error.controlador
      );
    }
  },

  createadmin: async function (req, res) {
    try {
      if (process.env.CANCREATEADMIN == '1') {
        const parseResult = validator.createadmin.safeParse(req.body);

        if (!parseResult.success) {
          logger.error(parseResult);
          response.renderError(req, res, constants.error.validacion);
          return;
        }

        const respuesta = await service.createadmin({
          ...parseResult.data,
          host: domain(req.headers.host),
        });

        if (respuesta === true) {
          response.renderMessage(
            req,
            res,
            200,
            constants.messages.createadmin.h1,
            constants.messages.createadmin.p,
            'success'
          );
        } else {
          response.renderMessage(req, res, 500, constants.error.interno, respuesta, 'danger');
        }
      } else {
        res.redirect('/');
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.createadmin + ' ' + constants.error.controlador
      );
    }
  },

  createbyadmin: async function (req, res) {
    try {
      const parseResult = validator.createbyadmin.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const created = await service.createbyadmin({
        ...parseResult.data,
        host: domain(req.headers.host),
      });

      if (typeof created === 'string') {
        throw new Error(created);
      }

      response.APISuccess(res);
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.createbyadmin + ' ' + constants.error.controlador
      );
    }
  },

  updatebyadmin: async function (req, res) {
    try {
      const type = req.body.type;
      let aux;

      switch (type) {
        case 'roles':
          aux = 'updatebyadmin_roles';
          break;
        case 'activate':
          aux = 'updatebyadmin_activate';
          break;
        case 'password':
          aux = 'updatebyadmin_password';
          break;
        case 'notify':
          aux = 'updatebyadmin_notify';
          break;
        default:
          throw new Error('invalid type');
      }

      let parseResult = {};

      if (type !== 'notify') {
        parseResult = validator[aux].safeParse(req.body);

        if (!parseResult.success) {
          logger.error(parseResult);
          response.APIError(req, res, constants.error.validacion);
          return;
        }
      }

      const respuesta = await service[aux](
        {
          ...parseResult.data,
          host: domain(req.headers.host),
        },
        req.params.id
      );

      if (respuesta === true) {
        response.APISuccess(res);
      } else {
        logger.error(respuesta);
        response.APIError(req, res, respuesta);
      }
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.updatebyadmin + ' ' + constants.error.controlador
      );
    }
  },

  deletebyadmin: async function (req, res) {
    try {
      const parseResult = validator.deletebyadmin.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.deletebyadmin({
        ...parseResult.data,
        host: domain(req.headers.host),
      });

      if (respuesta === true) {
        response.APISuccess(res);
      } else {
        logger.error(respuesta);
        response.APIError(req, res, respuesta);
      }
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.deletebyadmin + ' ' + constants.error.controlador
      );
    }
  },
};
