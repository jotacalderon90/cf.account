'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');
const googleapis = require('../googleapis');
const hooks = require('../hooks');

const repositorio = require('../03.user/repository');

module.exports = {
  
  googleoauth: async function(input) {
    try {
      
      return googleapis.getURL();
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.googleoauth + ' ' + constants.error.servicio);
    }
  }, 

  googleoauthcallback: async function(input) {
    try {
      
      const user = await googleapis.getUserInfo(input.code);
      
      const email = user.emails[0].value;
      
      const users = await repositorio.find({email: email});
      
      let respuesta;
      
      let id;

      if(users.length === 0){
        
        const nuevoUsuario = {};
        nuevoUsuario.email = email;
        nuevoUsuario.nickname = email;
        nuevoUsuario.thumb = user.image.url;
        nuevoUsuario.activate = true;
        nuevoUsuario.roles = ['user'];
        
        respuesta = await repositorio.create(nuevoUsuario);
        logger.info(respuesta);
        
        if(!respuesta.acknowledged) {
          throw new Error(respuesta);
        }
        
        id = respuesta.insertedId.toString();
        
      }else{
        
        const usuarioActualizar = {};
        usuarioActualizar.thumb = user.image.url,
        usuarioActualizar.google = user;
        
        respuesta = await repositorio.update(usuarioActualizar, users[0]._id);
        logger.info(respuesta);
        
        id = users[0]._id.toString();
        
      }
      
      hooks.pushOnLogin(email);
      
      return {_id: id, email: email};
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.googleoauthcallback + ' ' + constants.error.servicio);
    }
  }, 

  send: async function(input) {
    try {
      
      return await googleapis.sendMemo(input.tokens,input.raw);
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.send + ' ' + constants.error.servicio);
    }
  }
  
}