"use strict";

const controlador = require('./lib/02.account.crud/controller');

module.exports = {
	
	//@route('/api/account')
	//@method(['post'])
	create: async function(req,res){
    controlador.create(req,res);//internamente update+delete
	},
	
	//@route('/api/account')
	//@method(['get'])
	read: async function(req,res){
    controlador.read(req,res);
	}
	
}