'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const request = require('cl.jotacalderon.cf.framework/lib/request');

module.exports = {
  
  pushOnCreate: async function(email) {
    try{
      
      if(process.env.HOST_PUSH){
        
        request.post(process.env.HOST_PUSH + '/api/push/admin',{
          headers: {
            ['x-api-key']: process.env.HOST_PUSH_X_API_KEY
          }
        },{
          title: 'nueva cuenta', 
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
					
        request.post(process.env.HOST_MAILING + '/api/mailing', {}, {
          to: doc.email,
          hash: process.env.HOST + "/api/account/activate/" + new Buffer(doc.password).toString("base64"),
          subject: 'Activación de cuenta',
          type: 'template',
          template: 'accountActivate.html',
          send: true
          
        });
      }
    }catch(error) {
      logger.error(error);
    }
  }
}

