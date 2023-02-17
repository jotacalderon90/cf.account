"use strict";

const mongodb = require('./mongodb');

module.exports = {
	createLog: function(req){
		if(!(process.env.MONGO_URL && process.env.MONGO_DBNAME)){
			return;
		}
		mongodb.insertOne("log",{date: new Date(), url: req.originalUrl, method: req.method, headers: req.headers, body: req.body});
	}	
};