"use strict";

const http	= require("http");
const https	= require("https");

const logger = require('./log')('lib.requestAsync');

const self = function(){
	
}

self.prototype.response = function(res,resolve){
	let rawData = '';
	res.setEncoding('utf8');
	res.on('data', (chunk) => { rawData += chunk; });
	res.on('end', () => {
		logger.info(res.statusCode);
		logger.info(rawData);
		resolve();
	});
}

self.prototype.onError = function(e,resolve){
	logger.info('Error:');
	logger.info(e);
	resolve();	
}

self.prototype.get = function(URL,OPTIONS){
	return new Promise((resolve,reject)=>{
		const lib = (URL.indexOf('https')>-1)?https:http;
		lib.get(URL, ( OPTIONS || {} ), (res) => this.response(res,resolve))
		.on('error', (e) => this.onError(e,resolve));
	});
}

self.prototype.submit = function(URL,OPTIONS,BODY){
	return new Promise((resolve,reject)=>{
		const data = JSON.stringify(BODY);
		const lib = (URL.indexOf('https')>-1)?https:http;
		const req = lib.request(URL, OPTIONS, (res) => this.response(res,resolve));
		req.on('error', (e) => this.onError(e,resolve));
		req.write(data);
		req.end();
	});
}

self.prototype.post = function(URL,OPTIONS,BODY){
	OPTIONS.method = 'POST';
	return this.submit(URL,OPTIONS,BODY);
}

self.prototype.put = function(URL,OPTIONS,BODY){
	OPTIONS.method = 'PUT';
	return this.submit(URL,OPTIONS,BODY);
}

self.prototype.delete = function(URL,OPTIONS,BODY){
	OPTIONS.method = 'DELETE';
	return this.submit(URL,OPTIONS,BODY);
}

module.exports = new self();