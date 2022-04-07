"use strict";

const fs = require("fs");
const path = require("path");

const logger = require('./lib/log')('backend');
const accesscontrol = require('./lib/accesscontrol');
const request = require('./lib/request');
const response = require('./lib/response');

//funcion generica que extrae un string dentro de un string
const extract = function(content,from,to){
	const index1 = content.indexOf(from) + from.length;
	content = content.substring(index1);
	const index2 = content.indexOf(to);
	return content.substring(0,index2);
}

module.exports = function(express){
	
	const ctrlFiles = fs.readdirSync(__dirname,"utf8").filter((row)=>{
		return row != 'index.js' && fs.statSync(path.join(__dirname,row)).isFile();
	});
	
	let SERVICECount = 0;

	const api = {};
	for(let i=0;i<ctrlFiles.length;i++){

		const APIName = ctrlFiles[i].replace('.js','');

		api[APIName] = require(__dirname + '/'+ APIName);
		const content = fs.readFileSync(process.cwd() + '/backend/' + ctrlFiles[i],"utf-8");
		
		const routes = content.split("//@route");
		for(let x=1;x<routes.length;x++){
			const data = routes[x];
			const uri = eval(extract(data,"(",")"));
			const method = eval(extract(data,"@method(",")"));
			const action = extract(data,")",":").split('\n').pop().trim();//extract(data,")\n\t",":").trim().split('\n').pop().trim();
			
			let roles = false;
			if(data.indexOf('@roles')>-1){
				roles = eval(extract(data,"@roles(",")"));
			}
			
			for(let y=0;y<method.length;y++){
				SERVICECount++;
				logger.info('loading service ' + APIName + ' ' + uri + ' [' + method + ':' + action + ']');
				express[method[y]](uri, async function(req,res,next){
					try{						
						if(api[APIName][action]){
							if(!roles){
								api[APIName][action](req,res,next);
							}else{
								
								//if(config.properties.account){
								//	req.user = await request.get(config.properties.account + '/api/account',{headers: {cookie: req.headers.cookie || null}});
								//}else{
									req.user = await accesscontrol.getUser(req);
								//}
								
								if(req.user==null || !accesscontrol.hasRole(req,roles)){
									response.unauthorize(req,res);
								}else{
									api[APIName][action](req,res,next);
								}
							}
						}else{
							logger.info("404 " + req.originalUrl + ' function not found ' + APIName + ' - ' + action);
							response.notFound(req,res);
						}
					}catch(e){
						logger.info(e);
						response.renderMessage(res,500,'Error en servidor',e.toString());
					}
				});
			}
		}
	}
	
	logger.info(SERVICECount + ' services loaded');
	
}