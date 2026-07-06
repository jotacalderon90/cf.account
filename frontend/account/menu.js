const menu = function() {
  
  this.HOSTS  = [
    {name: 'archivospublicos',  label: 'Archivos Públicos', defaultPort: 2201, defaultRoles: []},
    {name: 'archivosprivados',  label: 'Archivos Privados', defaultPort: 2203, defaultRoles: ['archivosprivados']},
    {name: 'database',          label: 'Base de Datos',     defaultPort: 2204, defaultRoles: ['database']},
    {name: 'mailing',           label: 'Mailing',           defaultPort: 2205, defaultRoles: ['mailing']}
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

  this.toSearch = {};
  for(let i=0;i<this.collection.length;i++) {
    this.toSearch[this.collection[i].name] = i;
  }
}

menu.prototype.getMenuHost = function(hostEntry) {
  const requiresRole = hostEntry.defaultRoles.length > 0;
  
  if (requiresRole && !this.parent.perfil) return null;
  
  const hasAccess = !requiresRole || hostEntry.defaultRoles.some(role => this.parent.perfil.isAdmin() || this.parent.perfil.hasRole(role));
  
  if (!hasAccess) return null;
  
  const entry = { ...hostEntry };
  
  if (env === 'development') {
    entry.host = `${location.protocol}//${location.host.replace('2202', entry.defaultPort)}`;
    return entry;
  }
  
  if (env === 'production') {
    entry.host = `https://${location.host.replace('account', entry.name)}`;
    return entry;
  }

  return null;
}

menu.prototype.getHost = function(name) {
  const indice = this.toSearch[name];
  if (indice) {
    return this.collection[indice];
  }
  return null;
}

app.modules.menu = menu;