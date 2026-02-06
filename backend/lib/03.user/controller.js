'use strict';

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
      
			if(req.user == null) {
        
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
  },
  
  activate: async function(req, res) {
    try{
      
      const parseResult = validator.activate.safeParse(req.body);
        
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
        
      const respuesta = await service.activate(parseResult.data);
        
      if(respuesta === true) {
        response.renderMessage(req, res, 200,'Activación de cuenta', 'Su registro ha sido activado satisfactoriamente','success');
        return;
      }else {
        response.renderError(req, res, respuesta);
        return;
      }
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.activate + ' ' + constants.error.controlador);
		}
  },
  
  forget: async function(req, res) {
    try{
      
			if(process.env.CANRECOVERY == '1'){
        
        await recaptcha.validate(req);
        
        const parseResult = validator.forget.safeParse(req.body);
        
        if (!parseResult.success) {
          response.renderError(req, res, constants.error.validacion);
          return;
        }
        
        const respuesta = await service.forget(parseResult.data);
        
        if(respuesta === true) {
          response.renderMessage(req, res, 200, 'Recuperación de cuenta','Se ha enviado un correo para poder reestablecer su contraseña','success');
          return;
        }else {
          response.renderError(req, res, respuesta);
          return;
        }
        
			}else{
        
				response.renderError(req, res, constants.error.rest.recoveryNOCAN);
        return;
        
      }
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.forget + ' ' + constants.error.controlador);
		}
  },
  
  recovery: async function(req, res) {
    try{
      
			if(process.env.CANRECOVERY == '1'){
         
        await recaptcha.validate(req);
          
        const parseResult = validator.recovery.safeParse(req.body);
          
        if (!parseResult.success) {
          response.renderError(req, res, constants.error.validacion);
          return;
        }
          
        const respuesta = await service.recovery(parseResult.data);
          
        if(respuesta === true) {
          response.renderMessage(req, res, 200, 'Recuperación de cuenta','Se ha recuperado su contraseña correctamente','success');
          return;
        
        }else {
          response.renderError(req, res, respuesta);
          return;
        }
          
      }else {
        response.renderError(req, res, constants.error.rest.recoveryNOCAN);
        return;
        
			}
        
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.recovery + ' ' + constants.error.controlador);
		}
  },
  
  login: async function(req, res) {
    try{
      
      await recaptcha.validate(req);
        
      const parseResult = validator.login.safeParse(req.body);
        
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.login(parseResult.data);
      
      if(typeof respuesta !== 'string') {
        
        const jwt = accesscontrol.encode(respuesta);
        
        session.create(req, res, jwt, respuesta.email);
        
        if(parseResult.data.jwt === true){
          
          res.send({data:jwt});
          
        }else{
          
          if(req.query.redirectTo && req.query.redirectTo.trim()!='' && req.query.redirectTo.trim()!='undefined'){
            res.redirect(301, req.query.redirectTo);
          }else{
            res.redirect('/');
          }
          
        }
        
      }else {
        if(parseResult.data.jwt === true){
          res.send({error: respuesta});
          
        }else{
          response.renderError(req, res, respuesta);
          
        }
        return;
      }
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.login + ' ' + constants.error.controlador);
		}
  },
  
  logout: async function(req, res) {
    try{
      
      session.destroy(req, res);
      
			if(req.query.jwt){
				res.send({data: true});
			}else{
				res.redirect('/login');
			}
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.logout + ' ' + constants.error.controlador);
		}
  }
  
}