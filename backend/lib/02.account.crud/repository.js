"use strict";

const path = require('path');
const logger = require('cl.jotacalderon.cf.framework/lib/log')(path.basename(__filename));

const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

const constants = require('./constants');

module.exports = {
  
  create: async function(input) {
    try {
      
      const doc = {};
      
      doc.email = input.email;
      doc.hash = input.hash;
      doc.password = input.password;
      doc.nickname = input.nickname;
      
      doc.activate = false;
      doc.notification = true;
      doc.roles = ['user'];
      doc.created = new Date();
      doc.thumb = process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/user.png';
      
      const inserted = await mongodb.insertOne('user', doc);
      
      return inserted;
      
    } catch(error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.repositorio);
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