(async function(){
	const logger = require('./backend/lib/log')('server');
	logger.info('ini code');
	
	try{
		
		logger.info('connect to database');
		const mongodb = require('./backend/lib/mongodb');
		await mongodb.connect();
		logger.info('connected to database');

		logger.info('import fs');
		const fs = require('fs');
		
		logger.info('import express');
		const ex = require('express');
		const express = ex();

		logger.info('import body-parser');
		const bodyParser = require('body-parser');
		express.use(bodyParser.json({limit: '50mb'})); 
		express.use(bodyParser.urlencoded({extended: true}));

		logger.info('import cookie-parser');
		const cookieParser = require('cookie-parser');
		express.use(cookieParser());

		logger.info('import compression');
		const compression = require('compression');
		express.use(compression());
		
		if(process.env.SESSION_SECRET){		
			logger.info('import express-session');
			const session = require('express-session');
			express.use(session({
				secret: process.env.SESSION_SECRET,
				resave: false,
				saveUninitialized: false,
				cookie: process.env.COOKIE_DOMAIN || undefined
			}));	
		}
		
		if(process.env.FILE_UPLOAD && process.env.FILE_UPLOAD.toString().trim()=='1'){
			logger.info('import express-fileupload');
			const upload = require('express-fileupload');
			express.use(upload());
		}
		
		logger.info('import helmet');
		const helmet = require('helmet');
		express.use(helmet());

		logger.info('import cors');
		const cors = require('cors');
		express.use(cors());

		logger.info('import render');
		const render = require('./backend/lib/render');
		express.engine("html", (filePath,data,callback)=>{
			return callback(null, render.processTemplate(fs.readFileSync(filePath,"utf8").toString(),data));
		});
		express.set("views", __dirname + '/frontend/');
		express.set("view engine", "html");
		
		logger.info('import response');
		const response = require('./backend/lib/response');
		
		express.use(function(req,res,next){
			logger.request(req);
			next();
		});
		
		if(process.env.FRONT_MULTIDOMAIN && process.env.FRONT_MULTIDOMAIN.toString().trim()=='1'){		
			express.use(function(req,res,next){
				//req.headers.host = 'www.demo.cl';
				const p = process.cwd() + '/frontend/' + req.headers.host + req.path;
				if(req.path != '/' && fs.existsSync(p)){
					res.sendFile(p);
				}else{
					next();
				}
			});
		}
		
		logger.info('public routes');
		require('./backend')(express);
		
		if(!process.env.STATIC_FOLDER || process.env.STATIC_FOLDER.toString().trim()=='1'){
			logger.info('public default folder');
			express.use('/', ex.static(__dirname + '/frontend'));
		}
		
		express.use(function(req,res,next){
			logger.info("404 " + req.originalUrl);
			response.notFound(req,res);
		});

		logger.info('import http');
		const http = require('http');
		const server = http.Server(express);

		if(process.env.SOCKET && process.env.SOCKET.toString().trim()!=''){		
			logger.info('load socket ' + process.env.SOCKET);
			(require('./backend/lib/' + process.env.SOCKET)).load(server);	
		}
		
		logger.info('start server');
		server.listen(80, function(){
			logger.info("server started in 80 port");
		});
		
	}catch(e){
		logger.info(e);
	}
})();