const object = function(parent) {
	console.log(parent);
}

object.prototype.start = async function(parent){
	this.parent = parent;
}

object.prototype.hasRole = function(role){
	return roles.indexOf(role) > -1;
}

app.modules.object = object;