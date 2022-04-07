"use strict";

const logger = require('./lib/log')('router.default');

module.exports = {
	
	//@route('/favicon.ico')
	//@method(['get'])
	favicon: function(req,res){
		res.redirect(process.env.HOST_ARCHIVOSPUBLICOS + '/media/img/favicon.ico');
	},
	
	//@route('/robots.txt')
	//@method(['get'])
	robots: function(req,res){
		res.redirect(process.env.HOST_ARCHIVOSPUBLICOS + '/media/doc/robots.txt');
	}
	
};