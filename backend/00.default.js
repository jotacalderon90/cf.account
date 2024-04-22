"use strict";

module.exports = {
	
	//@route('/favicon.ico')
	//@method(['get'])
	favicon: function(req,res){
		res.redirect(process.env.HOST_ARCHIVOSPUBLICOS + '/assets/img/favicon.ico');
	},
	
	//@route('/robots.txt')
	//@method(['get'])
	robots: function(req,res){
		res.setHeader('content-type', 'text/plain');
		res.send('User-agent: *\n\nDisallow: /');
	}
	
};