'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const googleapis = require('../googleapis');
const domain = require('../domain');
const view = require('../view');

const constants = require('./constants');
const validator = require('./validator');

module.exports = {
  renderIndex: async function (req, res) {
    try {
      res.render(await view('account/01.perfil/_', req.headers.host), {
        roles: JSON.stringify(req.user.roles),
        __hostAccount: domain.getHostAccount(req),
        user: req.user
          ? {
              email: req.user.email,
              nickname: req.user.nickname,
              password: req.user.password,
            }
          : {},
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderIndex + ' ' + constants.error.controlador
      );
    }
  },

  renderForm: async function (req, res) {
    try {
      if (process.env.CANCREATE == '1') {
        res.render(await view('account/02.form/_', req.headers.host), {
          action: '/api/account',
        });
      } else {
        res.redirect('/');
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderForm + ' ' + constants.error.controlador
      );
    }
  },

  renderLogin: async function (req, res) {
    try {
      res.render(await view('account/03.login/_', req.headers.host), {
        redirectTo: req.query.redirectoTo,
        google_auth: googleapis.getURL(),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderLogin + ' ' + constants.error.controlador
      );
    }
  },

  renderForget: async function (req, res) {
    try {
      if (process.env.CANRECOVERY == '1') {
        res.render(await view('account/04.forget/_', req.headers.host));
      } else {
        res.redirect('/');
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderForget + ' ' + constants.error.controlador
      );
    }
  },

  renderRecovery: async function (req, res) {
    try {
      if (process.env.CANRECOVERY == '1') {
        const parseResult = validator.renderRecovery.safeParse(req.query);
        if (!parseResult.success) {
          logger.error(parseResult);
          response.renderError(req, res, constants.error.validacion);
          return;
        }

        res.render(await view('account/05.recovery/_', req.headers.host), parseResult.data);
      } else {
        res.redirect('/');
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderRecovery + ' ' + constants.error.controlador
      );
    }
  },

  renderPoliticasPrivacidad: async function (req, res) {
    try {
      res.render(await view('account/politicas', req.headers.host));
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderPoliticasPrivacidad + ' ' + constants.error.controlador
      );
    }
  },

  renderCondicionesServicio: async function (req, res) {
    try {
      res.render(await view('account/condiciones', req.headers.host));
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderCondicionesServicio + ' ' + constants.error.controlador
      );
    }
  },

  renderAdminUsers: async function (req, res) {
    try {
      res.render(await view('account/06.admin_users/_', req.headers.host), {
        roles: JSON.stringify(req.user.roles),
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderAdminUsers + ' ' + constants.error.controlador
      );
    }
  },

  renderAdminRoles: async function (req, res) {
    try {
      res.render(await view('account/07.admin_roles/_', req.headers.host), {
        roles: JSON.stringify(req.user.roles),
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderAdminRoles + ' ' + constants.error.controlador
      );
    }
  },

  renderFormAdmin: async function (req, res) {
    try {
      if (process.env.CANCREATEADMIN == '1') {
        res.render(await view('account/02.form/_', req.headers.host), {
          action: '/api/admin/account/createadmin',
        });
      } else {
        res.redirect('/');
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.renderFormAdmin + ' ' + constants.error.controlador
      );
    }
  },
};
