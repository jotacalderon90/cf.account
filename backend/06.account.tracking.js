"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')('api.06.account.tracking');
const response = require('cl.jotacalderon.cf.framework/lib/response');
const redis = require('cl.jotacalderon.cf.framework/lib/redis');

module.exports = {
	
	//@route('/api/admin/tracking')
	//@method(['get'])
	//@roles(['root'])
  tracking: async function(req, res) {
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
      
      res.json({
        data: sessions
      });
        
    } catch (error) {
      logger.error(error);
			response.APIError(req,res,error);
    }
  }
	
}