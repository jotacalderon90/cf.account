"use strict";

const controlador = require('./lib/00.default/controller');

module.exports = {
	
	//@route('/favicon.ico')
	//@method(['get'])
	favicon: function(req,res){
		controlador.favicon(req,res);
	},
	
	//@route('/robots.txt')
	//@method(['get'])
	robots: function(req,res){
		controlador.robots(req,res);
	}
	
};