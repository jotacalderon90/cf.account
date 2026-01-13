"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');
const repository = require('./repository');

const password = require('../password');
const hooks = require('../hooks');

module.exports = {
  
  create: async function(input) {
    try {
      
      const nuevoUsuario = {};
      nuevoUsuario.email = input.email;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.password = await password.hash(input.password);
      
      const created = await repository.create(nuevoUsuario);
      logger.info(created);
      
      if(created === constants.error.rest.createEmailExiste) {
        return constants.error.rest.createEmailExiste;
      }
      
      hooks.pushOnCreate(nuevoUsuario.email);
      
      hooks.mailingOnCreate(nuevoUsuario.email, nuevoUsuario.password);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  
  read: async function(token) {
    try {
      
      return await repository.read(token);
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },
  
  update: async function(input, user) {
    try {
      
      //validaciones de negocio para password
      let redirect = '/';
      if(input.password != user.password){
        input.password = await password.hash(input.password);
        redirect = "/api/account/logout";
      }
      
      const updated = await repository.update(input, user);
      logger.info(updated);
      
      return redirect;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  
  delete: async function(id) {
    try {
      
      const deleted = await repository.delete(id);
      logger.info(deleted);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.delete + ' ' + constants.error.servicio);
    }
  }
  
}