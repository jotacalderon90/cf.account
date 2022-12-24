"use strict";

const http	= require("http");
const https	= require("https");

const logger = require('./log')('lib.request');

const self = function(){
	
}

self.prototype.response = function(res,url,options,resolve,reject){
	let rawData = '';
	res.setEncoding('utf8');
	res.on('data', (chunk) => { rawData += chunk; });
	res.on('end', () => {
		try{
			if(res.statusCode==200){
				if(rawData==''){
					resolve(null);
				}
				resolve(JSON.parse(rawData));
			}else{
				throw('status ' + res.statusCode + ', ' + rawData);
			}
		}catch(e){
			reject({url: url, options: options, error: e});
		}
	});
}

self.prototype.get = function(URL,OPTIONS){
	return new Promise((resolve,reject)=>{
		const lib = (URL.indexOf('https')>-1)?https:http;
		lib.get(URL, ( OPTIONS || {} ), (res) => this.response(res,URL,OPTIONS,resolve,reject))
		.on('error', (e) => {
			reject({url: URL, options: OPTIONS, error: e});
		});
	});
}

self.prototype.submit = function(URL,OPTIONS,BODY){
	return new Promise((resolve,reject)=>{
		const data = JSON.stringify(BODY);
		const lib = (URL.indexOf('https')>-1)?https:http;
		
		OPTIONS.headers = OPTIONS.headers || {};
		OPTIONS.headers['Content-Type'] ='application/json';
		OPTIONS.headers['Content-Length'] = data.length;
		
		const req = lib.request(URL, OPTIONS, (res) => this.response(res,URL,OPTIONS,resolve,reject));
		req.on('error', (e) => {
			reject({url: URL, description: e});
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