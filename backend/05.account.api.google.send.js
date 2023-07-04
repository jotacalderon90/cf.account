"use strict";

const googleapis = require('./lib/googleapis');

module.exports = {
	
	//@route('/api/google/send')
	//@method(['post'])
	send: async function(req,res){
		try{
			res.send({data: await googleapis.sendMemo(req.user.tokens,req.body.raw)});
		}catch(e){
			response.APIError(req,res,e);
		}
	}
	
}