"use strict";

const mongodb = require('./mongodb');

module.exports = {
	createLog: function(req){
		mongodb.insertOne("log",{date: new Date(), url: req.originalUrl, method: req.method, headers: req.headers, body: req.body});
	}	
};