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
		resolve(rawData);
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
		
		OPTIONS.headers = OPTIONS.headers || {};
		OPTIONS.headers['Content-Type'] ='application/json';
		OPTIONS.headers['Content-Length'] = data.length;
		
		const req = lib.request(URL, OPTIONS, function(res) {
			let rawData = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				
				if(res.statusCode==400 && rawData.indexOf('SyntaxError: Unexpected end of JSON input') > -1){
					//reenviar sin content length
					logger.info('2° intento');
					
					const data2 = JSON.stringify(BODY);
					const lib2 = (URL.indexOf('https')>-1)?https:http;
					
					const req2 = lib.request(URL, {method: OPTIONS.method, headers: {'content-type':'application/json'}}, function(res) {
						rawData = '';
						res.setEncoding('utf8');
						res.on('data', (chunk) => { rawData += chunk; });
						res.on('end', () => {
							logger.info(res.statusCode);
							logger.info(rawData);
							resolve();	
						});
					});
					
					req2.on('error', function(e){
						logger.info('Error:');
						logger.info(e);
						resolve();	
					});
					
					req2.write(data2);
					
					req2.end();
					
					
				}else{				
					logger.info(res.statusCode);
					logger.info(rawData);
					resolve();	
				}
			});
		});
		
		req.on('error', function(e){
			logger.info('Error:');
			logger.info(e);
			resolve();	
		});
		
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