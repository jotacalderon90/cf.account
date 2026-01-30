"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const redis = require('cl.jotacalderon.cf.framework/lib/redis');

const constants = require('./constants');

const repositorio = require('../02.account.user/repository');
const hooks = require('../hooks');
const password = require('../password');

module.exports = {
  
  tracking: async function() {
    try {
      
      const sessions = [];
      
      if(process.env.REDIS_HOST) {
        const keys = await redis.keys();
        
        for (const key of keys) {
          const data = await redis.get(key);
          if (data) {
            sessions.push(data);
          }
        }
      }
      
      return sessions;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.tracking + ' ' + constants.error.servicio);
    }
  },
  
  count: async function(input) {
    try {
      
      const query = {};
      
      if(input.roles) {
        query.roles = input.roles;
      }
      
      const respuesta = await repositorio.count(query);
      
      return respuesta;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.count + ' ' + constants.error.servicio);
    }
  },
  
  collection: async function(input) {
    try {
      
      const query = {};
      
      if(input.roles) {
        query.roles = input.roles;
      }
      
      const options = {
        projection: {
          email: 1,
          roles: 1,
          activate:1
        },
        sort: {
          created: -1
        },
        limit: 50,
        skip: input.skip
      };
      
      const respuesta = await repositorio.find(query, options);
      
      return respuesta;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },
  
  tag: async function() {
    try {
      
      const respuesta = await repositorio.tag();
      
      return respuesta;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.tag + ' ' + constants.error.servicio);
    }
  },
  
  createadmin: async function(input) {
    try {
      
      const users = await repositorio.find({email: input.email});
      
      if(users.length > 0){
        return 'email ingresado ya existe';
      }
      
      const nuevoUsuario = {};
      nuevoUsuario.email = input.email;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.password = await password.hash(input.password);
			nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + "/assets/img/user.png";
      nuevoUsuario.activate = true;
      nuevoUsuario.roles = ['root'];
       
      const respuesta = await repositorio.create(nuevoUsuario);
      logger.info(respuesta);
        
      if(!respuesta.acknowledged) {
        throw new Error(respuesta);
      }
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.createadmin + ' ' + constants.error.servicio);
    }
  },
  
  createbyadmin: async function(input) {
    try {
      
      const users = await repositorio.find({email: input.email});
      
      if(users.length > 0){
        return 'email ingresado ya existe';
      }
      
      const nuevoUsuario = {};
      nuevoUsuario.email = input.email;
      nuevoUsuario.nickname = input.email;
      nuevoUsuario.password = await password.hash(input.password);
			nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + "/assets/img/user.png";
      nuevoUsuario.activate = true;
      nuevoUsuario.roles = ['user'];
       
      const respuesta = await repositorio.create(nuevoUsuario);
      logger.info(respuesta);
        
      if(!respuesta.acknowledged) {
        throw new Error(respuesta);
      }
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.createbyadmin + ' ' + constants.error.servicio);
    }
  },
  
  updatebyadmin_roles: async function(input, id) {
    try {
      
      const respuesta = await repositorio.update(input, id);
      logger.info(respuesta);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },
  
  updatebyadmin_activate: async function(input, id) {
    try {
      
      const respuesta = await repositorio.update(input, id);
      logger.info(respuesta);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },
  
  updatebyadmin_password: async function(input, id) {
    try {
      
      const respuesta = await repositorio.update({password: await password.hash(input.password)}, id);
      logger.info(respuesta);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },
  
  updatebyadmin_notify: async function(input, id) {
    try {
      
      const user = await repositorio.read(id);
      const hash = new Buffer(user.password).toString("base64");
      
      hooks.mailingOnForget(user.email, hash);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.updatebyadmin + ' ' + constants.error.servicio);
    }
  },
  
  deletebyadmin: async function(input) {
    try {
      
      const respuesta = await repositorio.delete(input.id);
      logger.info(respuesta);
        
      if(!respuesta.acknowledged) {
        throw new Error(respuesta);
      }
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.deletebyadmin + ' ' + constants.error.servicio);
    }
  }
  
}