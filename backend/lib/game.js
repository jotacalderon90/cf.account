"use strict";

const io = require("socket.io");
const logger = require('./log')('lib.game');

const self = function(){
	this.sockets = [];
}

self.prototype.load = function(server){
	this.server = io(server);
	this.server.on("connection", (socket)=>{ this.connection(socket)});
}

self.prototype.connection = function(socket){
	const socketId = socket.request.connection._peername.address + socket.request.connection._peername.family + socket.request.connection._peername.port;
	
	socket.on("mts", (data)=>{this.mts(data, socketId)});
	socket.on("disconnect", ()=>{this.disconnect(socketId)});
	
	this.sockets.push({socketId: socketId});
	
	logger.info('new client socket ' + socketId + ' (' + this.sockets.length + ')');
	
}

self.prototype.send = function(data){
	this.server.sockets.emit("mtc", {msg: (new Buffer(JSON.stringify(data))).toString('base64')});
}

self.prototype.mts = function(data, socketId){
	let d = {};
	try{
		
		const datoDecode = JSON.parse(decodeURIComponent(new Buffer(data.msg,"base64")));
		
		/*este socket se usa para que 2 clientes puedan interactuar y compartirse información*/
		
		switch(datoDecode.action){
			case 'userIn':
				const sockets = this.getSocketsByDocumentId(datoDecode.documentId).length;
				if(sockets == 2){
					datoDecode.response = 'userLimit';
					this.send(datoDecode);
				}else{
					this.getSocketById(socketId).documentId = datoDecode.documentId;
					this.getSocketById(socketId).clientId = datoDecode.clientId;
					
					datoDecode.response = sockets + 1;
					
					this.send(datoDecode);
				}
				return;
			break;
			case 'userSetIndex':
				this.getSocketById(socketId).clientIndex = datoDecode.clientIndex;
				datoDecode.response = true;
				this.send(datoDecode);
			break;
			case 'userGetIndex':
				const clientIndex = (this.getSocketsByDocumentId(datoDecode.documentId)[0].clientIndex==1)?2:1;
				this.getSocketById(socketId).clientIndex = clientIndex;
				datoDecode.response = clientIndex;
				this.send(datoDecode);
			break;
			case 'userFinish':
				this.send(datoDecode);
			break;
		}
	}catch(e){
		logger.info('mts');
		logger.info(e);
	}
}

self.prototype.disconnect = function(socketId){
	const index = this.sockets.findIndex(r=>{
		return r.socketId===socketId;
	});
	if(index >- 1){
		this.send({action: 'userOut', ...this.sockets[index]});
		this.sockets.splice(index,1);
		logger.info(index + "disconnected");
	}
}

self.prototype.getSocketById = function(socketId){
	return this.sockets.filter((r)=>{return r.socketId === socketId})[0];
}

self.prototype.getSocketsByDocumentId = function(documentId){
	return this.sockets.filter((r)=>{return r.documentId === documentId});
}

module.exports = new self();