'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');
const accesscontrol = require('cl.jotacalderon.cf.framework/lib/accesscontrol');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const session = require('../session');

module.exports = {
  
  googleoauth: async function(req, res) {
    try{
      
      const respuesta = await service.googleoauth();
      
      res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.googleoauth + ' ' + constants.error.controlador);
		}
  },
  
  googleoauthcallback: async function(req, res) {
    try{
      
      const parseResult = validator.googleoauthcallback.safeParse(req.query);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.googleoauthcallback(parseResult.data);
      
      const jwt = accesscontrol.encode(respuesta);
      
			session.create(req, res, jwt, respuesta.email);
      
      res.redirect('/');
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.googleoauthcallback + ' ' + constants.error.controlador);
		}
  },
  
  send: async function(req, res) {
    try{
      
      const parseResult = validator.send.safeParse(req.query);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.send({
        ...parseResult.data,
        tokens: req.user.google.tokens
      });
      
      res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.send + ' ' + constants.error.controlador);
		}
  }
  
}