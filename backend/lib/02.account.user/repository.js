'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

const constants = require('./constants');

module.exports = {
  
  create: async function(input) {
    try {
      
      const cantXEmail = await mongodb.count("user",{
        email: input.email
      });
      
      if(cantXEmail != 0){
        return constants.error.rest.createEmailExiste;
      }
      
      const nuevoUsuario = {};
      
      nuevoUsuario.email = input.email;
      nuevoUsuario.hash = input.hash;
      nuevoUsuario.password = input.password;
      nuevoUsuario.nickname = input.nickname;
      nuevoUsuario.thumb = input.thumb;
      nuevoUsuario.activate = input.activate;
      nuevoUsuario.roles = input.roles;
      
      nuevoUsuario.notification = true;
      nuevoUsuario.created = new Date();
      
      const created = await mongodb.insertOne('user', nuevoUsuario);
      
      return created;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.repositorio);
    }
  },
  
  read: async function(id) {
    try {
      
      const user = await mongodb.findOne('user', id);
      
      return user;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },
  
  update: async function(input, id) {
    try {
      
      const updated = await mongodb.updateOne('user', id, {$set: input});
			
      return updated;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.repositorio);
    }
  },
  
  delete: async function(id) {
    try {
      
      const deleted = await mongodb.deleteOne('user', id);
      
      return deleted;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.repositorio);
    }
  },

  find: async function(query, options) {
    try {
      
      const users = await mongodb.find('user', query, options);
      
      return users;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.find + ' ' + constants.error.repositorio);
    }
  },
  
  count: async function(query) {
    try {
      
      const total = await mongodb.count('user', query);
      
      return total;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.count + ' ' + constants.error.repositorio);
    }
  },
  
  tag: async function() {
    try {
      
      const tag = await mongodb.distinct('user', 'roles');
      
      return tag;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.tag + ' ' + constants.error.repositorio);
    }
  }

}