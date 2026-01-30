"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');
const password = require('../password');

module.exports = {
  
  parcheargon: async function(input) {
    try {
      
      return await password.hash(input.password)
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.parcheargon + ' ' + constants.error.servicio);
    }
  }
  
}