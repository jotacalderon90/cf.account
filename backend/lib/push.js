"use strict";

const webpush = require('web-push');
const mongodb = require('./mongodb');
const logger = require('./log')('lib.push');

const self = function(){
	
	this.vapidKeys = { publicKey: process.env.PUSH_PUBLIC, privateKey: process.env.PUSH_PRIVATE };
	
	if(process.env.PUSH_PUBLIC != '' && process.env.PUSH_PRIVATE != ''){
		this.configure();
	}
	
}

self.prototype.generate = function(){
	this.vapidKeys = webpush.generateVAPIDKeys();
}

self.prototype.configure = function(){
	webpush.setVapidDetails('mailto:' + process.env.ADMIN, this.vapidKeys.publicKey, this.vapidKeys.privateKey);
}

self.prototype.send = async function(push,data){
	try{
		webpush.sendNotification(push, JSON.stringify(data));
	}catch(e){
		logger.info(e);
	}
}

self.prototype.notificateToAdmin = async function(title,body,uri){
	try{
		const rows = await mongodb.find("push",{roles: {$in: ["root","admin"]}});
		for(let i=0;i<rows.length;i++){
			this.send(rows[i],{title: title, body: body, uri: uri});
		}
	}catch(e){
		logger.info(e);
	}
}

module.exports = new self();