'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const request = require('cl.jotacalderon.cf.framework/lib/request');

module.exports = {
  
  pushOnCreate: async function(email) {
    try{
      
      if(process.env.HOST_PUSH){
        
        request.post(process.env.HOST_PUSH + '/api/push/admin',{
          headers: {
            'x-api-key': process.env.HOST_PUSH_X_API_KEY
          }
        }, {
          title: 'nueva cuenta', 
          body: email
        });
      }
    }catch(error) {
      logger.error(error);
    }
  },
  
  pushOnLogin: async function(email) {
    try{
      
      if(process.env.HOST_PUSH){
        
        request.post(process.env.HOST_PUSH + '/api/push/admin',{
          headers: {
            'x-api-key': process.env.HOST_PUSH_X_API_KEY
          }
        }, {
          title: 'Login ' + (new Date().toISOString()), 
          body: email
        });
        
      }
      
    }catch(error) {
      logger.error(error);
    }
  },
  
  mailingOnCreate: async function(email,hash) {
    try {
      if(process.env.HOST_MAILING){
					
        request.post(process.env.HOST_MAILING + '/api/mailing/multidomainmicro', {
          headers: {
            'x-api-key': process.env.HOST_MAILING_X_API_KEY
          }
        }, {
          host: process.env.HOST.split('//')[1],
          to: email,
          subject: 'Activación de cuenta',
          template: 'accountActivate.html',
          hash: process.env.HOST + '/api/account/activate/' + hash,
          message: 'Este dato no se usa pero se valida en mailing :S'
        });
      }
    }catch(error) {
      logger.error(error);
    }
  },
  
  mailingOnForget: async function(email,hash) {
    try {
      if(process.env.HOST_MAILING){
        
        request.post(process.env.HOST_MAILING + '/api/mailing/multidomainmicro', {
          headers: {
            'x-api-key': process.env.HOST_MAILING_X_API_KEY
          }
        }, {
          host: process.env.HOST.split('//')[1],
          to: email,
          subject: 'Reestablecer contraseña',
          template: 'accountRecovery.html',
          hash: process.env.HOST + '/api/account/recovery?hash=' + hash,
          message: 'Este dato no se usa pero se valida en mailing :S'
        });
      }
    }catch(error) {
      logger.error(error);
    }
  }
}

