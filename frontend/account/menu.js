const menu = function() {
  
  this.HOSTS  = [
    {hostname: 'archivospublicos',  label: 'Archivos Públicos', defaultPort: 2201, defaultRoles: []},
    {hostname: 'archivosprivados',  label: 'Archivos Privados', defaultPort: 2203, defaultRoles: ['archivosprivados']},
    {hostname: 'database',          label: 'Base de Datos',     defaultPort: 2204, defaultRoles: ['database']}
  ];
  
  this.collection = [];
}

menu.prototype.start = function(parent){
	this.parent = parent;
  
	this.collection = this.HOSTS.reduce((acc, hostEntry) => {
    const h = this.getMenuHost(hostEntry);
    if (h) acc.push(h);
    return acc;
  }, []);

}

menu.prototype.getMenuHost = function(hostEntry) {
  const requiresRole = hostEntry.defaultRoles.length > 0;
  
  if (requiresRole && !this.parent.perfil) return null;
  
  const hasAccess = !requiresRole || hostEntry.defaultRoles.some(role => this.parent.perfil.isAdmin() || this.parent.perfil.hasRole(role));
  
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

app.modules.menu = menu;