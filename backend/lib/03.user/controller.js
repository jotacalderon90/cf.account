'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');
const accesscontrol = require('cl.jotacalderon.cf.framework/lib/accesscontrol');
const recaptcha = require('cl.jotacalderon.cf.framework/lib/recaptcha');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const session = require('../session');
const jwt = require('../jwt');
const domain = require('../domain');

module.exports = {
  create: async function (req, res) {
    try {
      req.user = await accesscontrol.getUser(req);

      if (req.user == null || req.body.button === '' || req.body.button === undefined) {
        //POST!

        if (process.env.CANCREATE != '1') {
          logger.error(constants.error.rest.createNOCAN);
          response.renderError(req, res, constants.error.rest.createNOCAN);
          return;
        }

        //VALIDO RECAPTCHA
        await recaptcha.validate(req);

        //VALIDO INPUT
        const parseResult = validator.create.safeParse(req.body);

        if (!parseResult.success) {
          logger.error(parseResult);
          response.renderError(req, res, constants.error.validacion);
          return;
        }

        //EJECUTO SERVICIO
        const respuesta = await service.create({
          ...parseResult.data,
          host: domain.getParentDomain(req.headers.host),
        });

        if (respuesta === true) {
          response.renderMessage(
            req,
            res,
            200,
            'Usuario registrado',
            'Se ha enviado un correo para validar su registro',
            'success'
          );
          return;
        } else {
          logger.error(respuesta);
          response.renderError(req, res, respuesta);
          return;
        }

        //DELEGO OTROS METODOS BAJO FORMULARIO DE PERFIL!
      } else if (req.body.button && req.body.button === 'UPDATE') {
        //this.update(req, res);
        try {
          const parseResult = validator.update.safeParse(req.body);

          if (!parseResult.success) {
            logger.error(parseResult);
            response.renderError(req, res, constants.error.validacion);
            return;
          }

          const respuesta = await service.update(parseResult.data, req.user);

          res.redirect(respuesta);
        } catch (error) {
          logger.error(error);
          response.renderError(
            req,
            res,
            constants.error.rest.update + ' ' + constants.error.controlador
          );
        }
      } else if (req.body.button && req.body.button === 'DELETE') {
        //this.delete(req, res);
        try {
          await service.delete(req.user.id);

          session.destroy(req, res);

          response.renderMessage(
            req,
            res,
            200,
            'Usuario eliminado',
            'Se ha eliminado su cuenta satisfactoriamente',
            'success'
          );
        } catch (error) {
          logger.error(error);
          response.renderError(
            req,
            res,
            constants.error.rest.delete + ' ' + constants.error.controlador
          );
        }
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.create + ' ' + constants.error.controlador
      );
    }
  },

  read: async function (req, res) {
    try {
      const token = jwt.getToken(req);

      if (token != null && token.sub) {
        const respuesta = await service.read({
          id: token.sub,
          host: domain.getParentDomain(req.headers.host),
        });

        res.send({ data: respuesta });
      } else {
        res.send({ data: null });
      }
    } catch (error) {
      logger.error(error);
      response.renderError(req, res, constants.error.rest.read + ' ' + constants.error.controlador);
    }
  },

  update: async function (req, res) {
    try {
      const parseResult = validator.update.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.update(parseResult.data, req.user);

      res.redirect(respuesta);
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.update + ' ' + constants.error.controlador
      );
    }
  },

  delete: async function (req, res) {
    try {
      await service.delete(req.user.id);

      session.destroy(req, res);

      response.renderMessage(
        req,
        res,
        200,
        'Usuario eliminado',
        'Se ha eliminado su cuenta satisfactoriamente',
        'success'
      );
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.delete + ' ' + constants.error.controlador
      );
    }
  },

  activate: async function (req, res) {
    try {
      const parseResult = validator.activate.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.activate({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      if (respuesta === true) {
        response.renderMessage(
          req,
          res,
          200,
          'Activación de cuenta',
          'Su registro ha sido activado satisfactoriamente',
          'success'
        );
        return;
      } else {
        logger.error(respuesta);
        response.renderError(req, res, respuesta);
        return;
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.activate + ' ' + constants.error.controlador
      );
    }
  },

  forget: async function (req, res) {
    try {
      if (process.env.CANRECOVERY == '1') {
        await recaptcha.validate(req);

        const parseResult = validator.forget.safeParse(req.body);

        if (!parseResult.success) {
          logger.error(parseResult);
          response.renderError(req, res, constants.error.validacion);
          return;
        }

        const respuesta = await service.forget({
          ...parseResult.data,
          host: domain.getParentDomain(req.headers.host),
        });

        if (respuesta === true) {
          response.renderMessage(
            req,
            res,
            200,
            'Recuperación de cuenta',
            'Se ha enviado un correo para poder reestablecer su contraseña',
            'success'
          );
          return;
        } else {
          logger.error(respuesta);
          response.renderError(req, res, respuesta);
          return;
        }
      } else {
        response.renderError(req, res, constants.error.rest.recoveryNOCAN);
        return;
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.forget + ' ' + constants.error.controlador
      );
    }
  },

  recovery: async function (req, res) {
    try {
      if (process.env.CANRECOVERY == '1') {
        await recaptcha.validate(req);

        const parseResult = validator.recovery.safeParse(req.body);

        if (!parseResult.success) {
          logger.error(parseResult);
          response.renderError(req, res, constants.error.validacion);
          return;
        }

        const respuesta = await service.recovery({
          ...parseResult.data,
          host: domain.getParentDomain(req.headers.host),
        });

        if (respuesta === true) {
          response.renderMessage(
            req,
            res,
            200,
            'Recuperación de cuenta',
            'Se ha recuperado su contraseña correctamente',
            'success'
          );
          return;
        } else {
          logger.error(respuesta);
          response.renderError(req, res, respuesta);
          return;
        }
      } else {
        response.renderError(req, res, constants.error.rest.recoveryNOCAN);
        return;
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.recovery + ' ' + constants.error.controlador
      );
    }
  },

  login: async function (req, res) {
    try {
      await recaptcha.validate(req);

      const parseResult = validator.login.safeParse(req.body);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const _domain = domain.getParentDomain(req.headers.host);

      const userLogged = await service.login({
        ...parseResult.data,
        host: _domain,
      });

      if (typeof userLogged === 'string') {
        if (parseResult.data.jwt === true) {
          res.send({ error: userLogged });
        } else {
          logger.error(userLogged);
          response.renderError(req, res, userLogged);
        }
        return;
      } else {
        if (!userLogged.email) {
          throw new Error(JSON.stringify(userLogged) + ' ' + constants.error.servicio);
        }
        const token = jwt.encode(userLogged.hash);

        session.create(req, res, token, userLogged.email, _domain);

        if (parseResult.data.token === true) {
          res.send({ data: token });
        } else {
          if (
            req.query.redirectTo &&
            req.query.redirectTo.trim() != '' &&
            req.query.redirectTo.trim() != 'undefined'
          ) {
            res.redirect(301, req.query.redirectTo);
          } else {
            res.redirect('/');
          }
        }
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.login + ' ' + constants.error.controlador
      );
    }
  },

  logout: async function (req, res) {
    try {
      if (req.user) {
        service.logout(req.user.id);
      }
      session.destroy(req, res);
      if (req.query.jwt) {
        res.send({ data: true });
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.logout + ' ' + constants.error.controlador
      );
    }
  },
};
