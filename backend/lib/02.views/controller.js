'use strict';

const fs = require('fs');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');

const googleapis = require('../googleapis');
const domain = require('../domain');

const viewName = function (view_path, host) {
  const view_path_host = 'assets/domains/' + host + '/' + view_path;
  const view_path_full =
    process.cwd() + '/' + (process.env.FRONTEND || 'frontend') + '/' + view_path_host + '.html';

  if (fs.existsSync(view_path_full)) {
    return view_path_host;
  }
  return view_path;
};

module.exports = {
  renderIndex: async function (req, res) {
    try {
      res.render(viewName('account/01.perfil/_', req.headers.host), {
        user: req.user,
        __hostAccount: domain.getHostAccount(req),
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
        res.render(viewName('account/02.form/_', req.headers.host), {
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
      res.render(viewName('account/03.login/_', req.headers.host), {
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
        res.render(viewName('account/04.forget/_', req.headers.host));
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
          response.renderError(req, res, constants.error.validacion);
          return;
        }

        res.render(viewName('account/05.recovery/_', req.headers.host), parseResult.data);
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
      res.render(viewName('account/politicas', req.headers.host));
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
      res.render(viewName('account/condiciones', req.headers.host));
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
      res.render(viewName('account/06.admin_users/_', req.headers.host), {
        user: req.user,
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
      res.render(viewName('account/07.admin_roles/_', req.headers.host), {
        user: req.user,
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
        res.render(viewName('account/02.form/_', req.headers.host), {
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
