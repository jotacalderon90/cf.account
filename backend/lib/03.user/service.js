'use strict';

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
      nuevoUsuario.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';
      nuevoUsuario.activate = (process.env.HOST_MAILING)? false: true;
      nuevoUsuario.roles = ['user'];
      
      const created = await repository.create(nuevoUsuario);
      logger.info(created);
      
      if(created === constants.error.rest.createEmailExiste) {
        return constants.error.rest.createEmailExiste;
      }
      
      hooks.pushOnCreate(nuevoUsuario.email);
      
      hooks.mailingOnCreate(nuevoUsuario.email, process.env.HOST + '/api/account/activate/' + Buffer.from(nuevoUsuario.password, 'utf8').toString('base64'));
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  
  read: async function(id) {
    try {
      
      const user = await repository.read(id);
      
      if(!user.activate){
        logger.error(constants.error.rest.login_desactivate + ' - ' + user.email);
        return null;
      }
      
      return user;
      
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
        redirect = '/api/account/logout';
      }
      
      const updated = await repository.update(input, user._id);
      logger.info(updated);
      
      return redirect;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.update + ' ' + constants.error.servicio);
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
  },
  
  activate: async function(input) {
    try {
      
      const hash = Buffer.from(input.hash, 'base64').toString('utf8');
      
      const users = await repository.find({password: hash});
      
      if(users.length != 1){
        return 'No se encontró usuario';
      }
      
      const respuesta = await repository.update({activate: true}, users[0]._id);
      logger.info(respuesta);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  
  forget: async function(input) {
    try {
      
      const users = await repository.find({email: input.email});
      
      if(users.length != 1){
        return 'No se encontró usuario';
      }
      
      const hash = Buffer.from(users[0].password, 'utf8').toString('base64');
      
      logger.info(hash);
      
      hooks.mailingOnForget(users[0].email, process.env.HOST + '/api/account/recovery?hash=' + hash);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  
  recovery: async function(input) {
    try {
      
      const users = await repository.find({password: Buffer.from(input.hash, 'base64').toString('utf8')});
      
      if(users.length != 1){
        throw new Error(constants.error.rest.forgetNoUser);
      }
      
      const user = users[0];
      
      const nuevosDatos = {
        password: await password.hash(input.password),
        nickname: user.nickname
      }
      
      const respuesta = await repository.update(nuevosDatos, user._id);
      
      logger.info(respuesta);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  
  login: async function(input) {
    try {
      
      const users = await repository.find({email: input.email, activate: true});
      
      if(users.length != 1){
        return 'No se encontró usuario';
      }
      
      if(!users[0].activate){
        return 'Usuario ha sido desactivado :S xd';
      }
      
      const isValidPassword = await password.verify(input.password, users[0].password);
      if(!isValidPassword) {
        return 'Los datos ingresados no corresponden .2';
      }
      
      hooks.pushOnLogin(input.email);
      
      return users[0];
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.login + ' ' + constants.error.servicio);
    }
  }
  
  
  
}