const perfil = function(parent) {
  
  const HOSTS  = [
    {hostname: 'archivospublicos',  label: 'Archivos Públicos', defaultPort: 2201, defaultRoles: []},
    {hostname: 'archivosprivados',  label: 'Archivos Privados', defaultPort: 2203, defaultRoles: ['archivosprivados']},
    {hostname: 'database',  label: 'Base de Datos', defaultPort: 2204, defaultRoles: ['database']}
  ];
  
  const getMenuHost = (hostEntry) => {
    
    const requiresRole = hostEntry.defaultRoles.length > 0;
    const hasAccess = !requiresRole || hostEntry.defaultRoles.some(role => this.isAdmin() || this.hasRole(role));

    if (!hasAccess) return null;
    
    const entry = { ...hostEntry };
    
    if (env === 'development') {
      entry.hostname = `${location.protocol}//${location.host.replace('2202', entry.defaultPort)}`;
      return entry;
    }
    
    if (env === 'production') {
      entry.hostname = `https://${location.host.replace('account', entry.hostname)}`;
      return entry;
    }

    return null;
  }
  
	this.menu = HOSTS.reduce((acc, hostEntry) => {
    const h = getMenuHost(hostEntry);
    if (h) acc.push(h);
    return acc;
  }, []);
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