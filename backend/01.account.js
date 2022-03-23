"use strict";

const logger = require('./lib/log')('router.01.account');
const response = require('./lib/response');

module.exports = {
	
	//@route('/login')
	//@method(['get'])
	renderLogin: function(){
		response.render(res,'login');
	}
}