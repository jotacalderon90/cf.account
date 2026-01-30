'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

module.exports = {
  
  favicon: async function(req, res) {
    try{
      res.redirect(process.env.HOST_ARCHIVOSPUBLICOS + '/favicon.ico');
		}catch(error){
			logger.error(error);
			response.APIError(req,res,constants.error.rest.favicon + ' ' + constants.error.controlador);
		}
  },
  
  robots: async function(req, res) {
    try{
      res.setHeader('content-type', 'text/plain');
      res.send('User-agent: *\n\nDisallow: /');
		}catch(error){
			logger.error(error);
			response.APIError(req,res,constants.error.rest.robots + ' ' + constants.error.controlador);
		}
  }
  
}