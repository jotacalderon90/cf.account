'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

module.exports = {
  
  parcheargon: async function(req, res) {
    try{
      
      const parseResult = validator.parcheargon.safeParse(req.query);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.parcheargon(parseResult.data);
      
      res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.parcheargon + ' ' + constants.error.controlador);
		}
  }
  
}