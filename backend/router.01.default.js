'use strict';

const controlador = require('./lib/01.default/controller');

module.exports = {
	
  /**
   * @swagger
   * /favicon.ico:
   *   get:
   *     tags:
   *       - Default
   *     summary: obtener favicon
   *     description: obtiene favicon
   */
	//@route('/favicon.ico')
	//@method(['get'])
	favicon: function(req,res){
		controlador.favicon(req,res);
	},
	
  /**
   * @swagger
   * /robots.txt:
   *   get:
   *     tags:
   *       - Default
   *     summary: obtener robots
   *     description: obtiene robots.txt
   */
	//@route('/robots.txt')
	//@method(['get'])
	robots: function(req,res){
		controlador.robots(req,res);
	}
	
};