'use strict';

const controlador = require('./lib/05.account.google/controller');

module.exports = {
	
	//@route('/api/account/googleoauth')
	//@method(['get'])
	googleoauth: async function(req,res){
		controlador.googleoauth(req,res);
	},
  
	//@route('/api/account/googleoauth/callback')
	//@method(['get'])
  googleoauthcallback: async function(req,res){
		controlador.googleoauthcallback(req,res);
	},
	
	//@route('/api/google/send')
	//@method(['get'])
	//@roles(['root','googleapis'])
	send: async function(req,res){
    controlador.send(req,res);
	}
	
}