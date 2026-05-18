const perfil = function() {
  
}

perfil.prototype.start = async function(parent){
	this.parent = parent;
}

perfil.prototype.hasRole = function(role){
	return user_roles.indexOf(role) > -1;
}

perfil.prototype.isAdmin = function(){
	return this.hasRole('root') || this.hasRole('admin');
}

app.modules.perfil = perfil;