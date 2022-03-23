"use strict";

const jwt = require("jwt-simple");

const self = function(){

}

self.prototype.encode = function(user){
	const iat = new Date();
	const exp = new Date(iat.getFullYear(),iat.getMonth(),iat.getDate(),iat.getHours(), iat.getMinutes() + 60);
	return jwt.encode({
		sub: user._id,
		//roles: user.roles,
		iat: iat,
		exp: exp
	},config.properties.secret);
}

self.prototype.decode = function(token){
	try{
		const payload = jwt.decode(token,config.properties.secret);
		if(new Date(payload.exp) <= new Date()){
			throw("expired");
		}
		return payload;
	}catch(e){
		return {error: e.toString()};
	}
}

self.prototype.getToken = function(req){
	let token = null;
	if(req.headers && req.headers.cookie){
		let cookies = req.headers.cookie.split(";");
		for(let i=0;i<cookies.length;i++){
			if(cookies[i].indexOf("Authorization=")>-1 && cookies[i].indexOf("=null")==-1){
				token = jwt.decode(cookies[i].split("=")[1].split(";")[0]);	
			}
		}
	}
	return token;
}

self.prototype.getUser = async function(req){
	try{
		const token = this.getToken(req);
		if(token.sub){
			return await mongodb.findOne("user",token.sub);
		}else{
			return null;
		}
	}catch(e){
		return null;
	}
}

self.prototype.hasRole = function(req,roles){
	for(let i=0;i<roles.length;i++){
		if(req.user.roles.indexOf(roles[i])>-1){
			return true;
		}
	}
	return false;
}

/*
self.prototype.authorize = async function(req,res,next){
	try{
		req.user = await helper.getUser(req);
		if(req.user==null){
			throw(401);
		}
		for(let i=0;i<roles.length;i++){
			if(req.user.roles.indexOf(roles[i])>-1){
				return next();
			}
		}
		throw(401);
	}catch(e){
		if(e==401){
			logger.info(helper.reqToLog(req));
			if(req.url.indexOf("/api/")>-1){
				res.sendStatus(401);
			}else{
				req.session.redirectTo = req.url;
				res.status(401).render("index", helper.toRenderError('401',e));
			}
		}else{
			logger.info(e);
			res.sendStatus(401);
		}
	}
}*/

module.exports = new self();