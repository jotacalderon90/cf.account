"use strict";

const controlador = require('./lib/99.account.parche.argon/controller');

module.exports = {
	
	//@route('/api/parcheargon')
	//@method(['get'])
  parcheargon: async function(req, res) {
    controlador.parcheargon(req,res);
  }
	
}