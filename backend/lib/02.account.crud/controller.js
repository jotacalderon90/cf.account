"use strict";

const path = require('path');
const logger = require('cl.jotacalderon.cf.framework/lib/log')(path.basename(__filename));

const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const sessionCookie = require('../session');

module.exports = {
  
  articulos: async function(req, res) {
    try{
      
      const parseResult = validator.articulos.safeParse(req.query);
      
      if (!parseResult.success) {
        logger.error(parseResult);
        throw new Error(constants.error.validacion);
      }
      
      const respuesta = await service.articulos(parseResult.data);
      
			res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
  },
  
  porllegar: async function(req, res) {
    try{
      
      const parseResult = validator.porllegar.safeParse(req.query);
      
      if (!parseResult.success) {
        logger.error(parseResult);
        throw new Error(constants.error.validacion);
      }
      
      const respuesta = await service.porllegar(parseResult.data);
      
			res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
  },
  
  validaexiste: async function(req, res) {
    try{
      
      const parseResult = validator.validaexiste.safeParse(req.query);
      
      if (!parseResult.success) {
        logger.error(parseResult);
        throw new Error(constants.error.validacion);
      }
      
      const respuesta = await service.validaexiste(parseResult.data);
      
			res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
  },
  
  total: async function(req, res) {
    try{
      
      const respuesta = await service.total();
      
			res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
  },
  
  collection: async function(req, res) {
    try{
      
      const respuesta = await service.collection();
      
			res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
  },
  
  create: async function(req, res) {
    try{
      
      const parseResult = validator.create.safeParse(req.body);
      
      if (!parseResult.success) {
        logger.error(parseResult);
        throw new Error(constants.error.validacion);
      }
      
      const respuesta = await service.create({...parseResult.data, creador: req.user.email});
      
			res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
  },
  
  delete: async function(req, res) {
    try{
      
      await service.delete(req.user._id);
      
      await session.logout(req, res);
      
			response.renderMessage(req, res, 200, 'Usuario eliminado', 'Se ha eliminado su cuenta satisfactoriamente','success');
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.delete + ' ' + constants.error.controlador);
		}
  }
  
}