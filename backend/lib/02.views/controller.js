"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');

const googleapis = require('../googleapis');

module.exports = {
  
  renderIndex: async function(req, res) {
    try{
      
      res.render('account/01.perfil/_', { 
        user: req.user
      });
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderIndex + ' ' + constants.error.controlador);
		}
  },
  
  renderForm: async function(req, res) {
    try{
      
      if(process.env.CANCREATE=='1'){
        res.render('account/02.form/_', { 
          action: '/api/account'
        });
        
      }else{
        res.redirect("/");
      
      }
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderForm + ' ' + constants.error.controlador);
		}
  },
  
  renderLogin: async function(req, res) {
    try{
      
      res.render('account/03.login/_', { 
        redirectTo: req.query.redirectoTo, 
        google_auth: googleapis.getURL()
      });
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderLogin + ' ' + constants.error.controlador);
		}
  },
  
  renderForget: async function(req, res) {
    try{
      
      if(process.env.CANRECOVERY == '1'){
        res.render('account/04.forget/_');

      }else{
        res.redirect("/");

      }
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderForget + ' ' + constants.error.controlador);
		}
  },
  
  renderRecovery: async function(req, res) {
    try{
      
      if(process.env.CANRECOVERY == '1'){
        
        const parseResult = validator.renderRecovery.safeParse(req.query);
        if (!parseResult.success) {
          response.renderError(req, res, constants.error.validacion);
          return;
        }
        
        res.render('account/05.recovery/_', parseResult.data);

      }else{
        res.redirect("/");

      }
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderRecovery + ' ' + constants.error.controlador);
		}
  },
  
  renderPoliticasPrivacidad: async function(req, res) {
    try{
      
      res.render('account/politicas');
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderPoliticasPrivacidad + ' ' + constants.error.controlador);
		}
  },
  
  renderCondicionesServicio: async function(req, res) {
    try{
      
      res.render('account/condiciones');
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderCondicionesServicio + ' ' + constants.error.controlador);
		}
  },
  
  renderAdmin: async function(req, res) {
    try{
      
      res.render('account/admin/_', { 
        user: req.user
      });
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderAdmin + ' ' + constants.error.controlador);
		}
  },
  
  renderFormAdmin: async function(req, res) {
    try{
      
      if(process.env.CANCREATEADMIN=='1'){
        res.render('account/02.form/_', {
          action: '/api/admin/account/createadmin'
        });

      }else{
        res.redirect("/");

      }
      
		}catch(error){
      logger.error(error);
			response.APIError(req,res,constants.error.rest.renderFormAdmin + ' ' + constants.error.controlador);
		}
  }
  
}