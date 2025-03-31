"use strict";

const logger = require('cl.jotacalderon.cf.framework/lib/log')('api.05.account.google.send');
const response = require('cl.jotacalderon.cf.framework/lib/response');
const googleapis = require('./lib/googleapis');

module.exports = {
	
	//@route('/api/google/send')
	//@method(['post'])
	//@roles(['root','googleapis'])
	send: async function(req,res){
		try{
			res.send({data: await googleapis.sendMemo(req.user.google.tokens,req.body.raw)});
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
	}
	
}