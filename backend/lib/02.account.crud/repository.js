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
      
      nuevoUsuario.activate = false;
      nuevoUsuario.notification = true;
      nuevoUsuario.roles = ['user'];
      nuevoUsuario.created = new Date();
      nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';
      
      const created = await mongodb.insertOne('user', nuevoUsuario);
      
      return created;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.repositorio);
    }
  },
  
  read: async function(token) {
    try {
      
      const user = await mongodb.findOne('user', token);
      
      return user;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },
  
  update: async function(input, user) {
    try {
      
      const updated = await mongodb.updateOne('user', user._id, {
        $set: {
					nickname: input.nickname,
          password: input.password
				}
      });
			
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
}