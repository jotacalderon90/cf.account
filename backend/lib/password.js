"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const argon2 = require('argon2');

module.exports = {
  
  isValid: function(plainPassword){
    
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    
    if (regex.test(plainPassword)) {
      return true;
      
    } else {
      return false;
      
    }
    
  },
  
  hash: async function(plainPassword) {
    try {
      
      const hash = await argon2.hash(plainPassword, {
        type: argon2.argon2id,
        memoryCost: 2048 * 64,  // 64 MB
        timeCost: 3,            // iteraciones
        parallelism: 4          // threads
      });
      
      return hash;
      
    } catch (error) {
      const myError = 'Error al hashear password';
      logger.error(myError);
      logger.error(error);
      throw new Error(myError);
    }
  },
  
  verify: async function(plainPassword, hashedPassword){
    try {
      
      const match = await argon2.verify(hashedPassword, plainPassword);
      
      return match;
    
    } catch (error) {
      const myError = 'Error al verificar password';
      logger.error(myError);
      logger.error(error);
      throw new Error(myError);
    }
  }
}