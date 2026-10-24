const perfil = function() {
  
}

perfil.prototype.start = async function(parent){
	this.parent = parent;
}

perfil.prototype.hasRole = function(role){
	if (Array.isArray(role)) {
    return role.some(r => user_roles.indexOf(r) > -1);
  }
  return user_roles.indexOf(role) > -1;
}

perfil.prototype.isAdmin = function(){
	return this.hasRole(['root','admin']);
}

app.modules.perfil = perfil;