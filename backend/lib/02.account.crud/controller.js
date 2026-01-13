"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const response = require('cl.jotacalderon.cf.framework/lib/response');
const accesscontrol = require('cl.jotacalderon.cf.framework/lib/accesscontrol');
const recaptcha = require('cl.jotacalderon.cf.framework/lib/recaptcha');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const session = require('../session');

module.exports = {
  
  create: async function(req, res) {
    try{
      
      req.user = await accesscontrol.getUser(req);
      
			if(req.user == null){
        
        //POST!
        
        if(process.env.CANCREATE!='1'){
          response.renderError(req, res, constants.error.rest.createNOCAN);
          return;
				}
        
        //VALIDO RECAPTCHA
        await recaptcha.validate(req);
        
        //VALIDO INPUT
        const parseResult = validator.create.safeParse(req.body);
        
        if (!parseResult.success) {
          response.renderError(req, res, constants.error.validacion);
          return;
        }
        
        //EJECUTO SERVICIO
        const respuesta = await service.create({
          ...parseResult.data
        });
        
        if(respuesta === true) {
          response.renderMessage(req, res, 200, 'Usuario registrado', 'Se ha enviado un correo para validar su registro','success');
          return;
        }else {
          response.renderError(req, res, respuesta);
          return;
        }
      
      //DELEGO OTROS METODOS!
      }else if(req.body.button && req.body.button === 'UPDATE'){
				this.update(req, res);
        
			}else if(req.body.button && req.body.button === 'DELETE'){
				this.delete(req, res);
        
			}
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.create + ' ' + constants.error.controlador);
		}
  },
  
  read: async function(req, res) {
    try{
      
      const token = accesscontrol.getToken(req);
      
      if(token != null && token.sub){
        
        const respuesta = await service.read(token.sub);
        
        res.send({data: respuesta});
        
      }else {
        res.send({data: null});
        
      }
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.read + ' ' + constants.error.controlador);
		}
  },
  
  update: async function(req, res) {
    try{
      
      const parseResult = validator.update.safeParse(req.body);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.update(parseResult.data, req.user);
      
      res.redirect(respuesta);
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.update + ' ' + constants.error.controlador);
		}
  },
  
  delete: async function(req, res) {
    try{
      
      await service.delete(req.user._id);
      
      session.destroy(req, res);
      
			response.renderMessage(req, res, 200, 'Usuario eliminado', 'Se ha eliminado su cuenta satisfactoriamente','success');
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.delete + ' ' + constants.error.controlador);
		}
  }
  
}