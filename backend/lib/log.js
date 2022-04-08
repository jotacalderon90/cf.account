
const fs = require('fs');
//const stream = fs.createWriteStream(process.cwd() + '/log.csv', {flags: 'a'});

const self = function(parent){
	this.parent = parent;
}

self.prototype.info = async function(data){
	console.log(this.parent, new Date().toLocaleString(), data);
}

self.prototype.request = async function(req){
	const content = req.method + ' ' + (req.connection.remoteAddress || req.headers["x-real-ip"]) + ' ' + req.originalUrl;
	this.info(content);
	//stream.write((new Date().toLocaleString() + ' ' + content).split(' ').join(';') + '\n');
}

module.exports = function(parent){
	return new self(parent);
};