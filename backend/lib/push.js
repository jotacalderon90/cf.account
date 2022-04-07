"use strict";

const fs = require("fs");
const webpush = require('web-push');
const mongodb = require('./mongodb');
const logger = require('./log')('lib.push');

const self = function(){
	
	let publicKey,privateKey;
	
	if(process.env.PUSH_PUBLIC && process.env.PUSH_PUBLIC!=''){
		
		publicKey = process.env.PUSH_PUBLIC;
		privateKey = process.env.PUSH_PRIVATE;
	
	}else{
		
		const vapidKeys = webpush.generateVAPIDKeys();
		publicKey = vapidKeys.publicKey;
		privateKey = vapidKeys.privateKey;
		
		logger.info('PUSH PUBLIC KEY' + publicKey);
		logger.info('PUSH PRIVATE KEY' + privateKey);
		
		//const c = JSON.parse(fs.readFileSync(process.cwd() + '/config.json','utf8'));
		//c.push = {public: publicKey, private: privateKey};
		//fs.writeFileSync(process.cwd() + '/config.json',JSON.stringify(c,undefined,"\t"));
	
	}
	
	webpush.setVapidDetails('mailto:' + process.env.ADMIN, publicKey, privateKey);
	
	this.publicKey = publicKey;
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
		const rows = await mongodb.find("user",{roles: {$in: ["root","admin"]}, push: {$exists: true}});
		for(let i=0;i<rows.length;i++){
			for(let x=0;x<rows[i].push.length;x++){
				const push = await mongodb.findOne("push",rows[i].push[x]);
				if(push!=null){
					this.send(push,{title: title, body: body, uri: uri});
				}
			}
		}
	}catch(e){
		logger.info(e);
	}
}

module.exports = new self();