'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');
const recaptcha = require('cl.jotacalderon.cf.framework/lib/recaptcha');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const session = require('../session');

module.exports = {
  
  tracking: async function(req, res) {
    try{
      
      const respuesta = await service.tracking();
      
      res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.tracking + ' ' + constants.error.controlador);
		}
  },
  
  count: async function(req, res) {
    try{
      
      const parseResult = validator.count.safeParse(req.query);
          
      if (!parseResult.success) {
        res.send({error: constants.error.validacion});
        return;
        
      }
      
      const respuesta = await service.count(parseResult.data);
      
      res.send({data: respuesta});
        
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.count + ' ' + constants.error.controlador);
		}
  },
  
  collection: async function(req, res) {
    try{
      
      const parseResult = validator.collection.safeParse(req.query);
          
      if (!parseResult.success) {
        res.send({error: constants.error.validacion});
        return;
        
      }
      
      const respuesta = await service.collection(parseResult.data);
      
      res.send({data: respuesta});
        
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.collection + ' ' + constants.error.controlador);
		}
  },
  
  tag: async function(req, res) {
    try{
      
      const respuesta = await service.tag();
      
      res.send({data: respuesta});
        
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.tag + ' ' + constants.error.controlador);
		}
  },
  
  createadmin: async function(req, res) {
    try{
      
      if(process.env.CANCREATEADMIN == '1'){
        
        const parseResult = validator.createadmin.safeParse(req.body);
          
        if (!parseResult.success) {
          response.renderError(req, res, constants.error.validacion);
          return;
          
        }
        
        const respuesta = await service.createadmin(parseResult.data);
        
        if(respuesta === true) {
          response.renderMessage(req, res, 200, constants.messages.createadmin.h1, constants.messages.createadmin.p, 'success');
          
        }else{
          response.renderMessage(req, res, 500, constants.error.interno, respuesta, 'danger');
        }

      }else{
        res.redirect('/');

      }
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.createadmin + ' ' + constants.error.controlador);
		}
  },
  
  createbyadmin: async function(req, res) {
    try{
      
      const parseResult = validator.createbyadmin.safeParse(req.body);
          
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
          
      }
        
      const respuesta = await service.createbyadmin(parseResult.data);
      
      res.send({data: true});
        
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.createbyadmin + ' ' + constants.error.controlador);
		}
  },
  
  updatebyadmin: async function(req, res) {
    try{
      
      const type = req.body.type;
      let aux;
      
      switch(type) {
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
      
      if(type !== 'notify') {
        
        parseResult = validator[aux].safeParse(req.body);
            
        if (!parseResult.success) {
          response.renderError(req, res, constants.error.validacion);
          return;
            
        }
        
      }
      
      const respuesta = await service[aux](parseResult.data, req.params.id);
      
      if(respuesta === true) {
        
        res.send({data: true});
        
      }else {
        
        res.send({error: respuesta});
      }
      
        
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.updatebyadmin + ' ' + constants.error.controlador);
		}
  },
  
  deletebyadmin: async function(req, res) {
    try{
      
      const parseResult = validator.deletebyadmin.safeParse(req.params);
          
      if (!parseResult.success) {
        res.send({error: constants.error.validacion});
        return;
        
      }
      
      const respuesta = await service.deletebyadmin(parseResult.data);
        
      if(respuesta === true) {
        res.send({data: true});
         
      }else{
        res.send({error: respuesta});
      }
        
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.deletebyadmin + ' ' + constants.error.controlador);
		}
  }
  
}