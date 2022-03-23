"use strict";

const logger = require('./lib/log')('router.01.account.views');
const response = require('./lib/response');

module.exports = {
	
	//@route('/')
	//@method(['get'])
	//@roles(['root','admin','user'])
	renderInfo: function(req,res){
		response.render(res,'info',{user: req.user});
	},
	
	//@route('/login')
	//@method(['get'])
	renderLogin: function(req,res){
		response.render(res,'login');
	},
	
	//@route('/new')
	//@method(['get'])
	renderNew: function(req,res){
		response.render(res,'new');
	},
	
	//@route('/forget')
	//@method(['get'])
	renderForget: function(req,res){
		response.render(res,'forget');
	}
}