"use strict";

const logger = require('./log')('lib.firsRun');
const mongodb  = require("./mongodb");
const readline = require('./readline');
const helper = require('./helper');

module.exports = (async function(){
	
	let r;
	
	r = await readline.ask("Confirme ejecución de primer levantamiento [S/N]: ");
	if(r.toUpperCase()!="S"){
		return;
	}
	
	logger.info('sin acciones definidas...');
	
})();