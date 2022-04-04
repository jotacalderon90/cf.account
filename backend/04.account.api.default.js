"use strict";

const logger = require('./lib/log')('router.account.api.default');
const response = require('./lib/response');
const mongodb = require('./lib/mongodb');

const onError = function(res,e){
	logger.info('ERROR:' + e.toString());
	logger.info(e);
	response.APIError(res,e);
}

module.exports = {
	
	//@route('/api/account/total')
	//@method(['get'])
	//@roles(['root','admin'])
	total: async function(req,res){
		try{
			req.query = (req.query.query && req.query.query!=':query')?JSON.parse(req.query.query):{};
			const total = await mongodb.count('user',req.query);
			res.send({data: total});
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/account/collection')
	//@method(['get'])
	//@roles(['root','admin'])
	collection: async function(req,res){
		try{
			req.options = (req.query.options)?JSON.parse(req.query.options):{};
			req.query = (req.query.query)?JSON.parse(req.query.query):{};
			const data = await mongodb.find('user',req.query,req.options);
			res.send({data: data});
		}catch(e){
			onError(res,e);
		}
	},
	
	//@route('/api/account/tag/collection')
	//@method(['get'])
	//@roles(['root','admin'])
	tag: async function(req,res){
		try{
			const data = await mongodb.distinct('user','roles');
			res.send({data: data});
		}catch(e){
			onError(res,e);
		}
	}
	
};