const roles = function() {
  
	this.name = 'roles';
	
  this.services = {
		collection: createService('GET', '/api/admin/' + this.name + '/collection'),
		create: createService('POST', '/api/admin/' + this.name),
		update: createService('PUT', '/api/admin/' + this.name + '/:id'),
		delete: createService('DELETE', '/api/admin/' + this.name + '/:id')
	}

	this.coll = [];
  this.filterText = '';
}

roles.prototype.start = async function(parent){
	this.parent = parent;
	try {
    
    this.canAdmin = this.parent.perfil.isAdmin();
    this.host_database = this.parent.menu.getHost('database');
    if (this.host_database) {
      this.can_goto_database = this.canAdmin || this.parent.perfil.hasRole(this.host_database.defaultRoles);
    }
		await this.refresh();
    
	} catch (error) {
		alert(error);
		console.log(error);
	}
}

roles.prototype.refresh = async function() {
	this.cant = 0;
	this.coll = [];
	await this.getCollection();
}

roles.prototype.getCollection = async function() {
	this.parent.loader.active = true;
	try {
		const coll = await this.services.collection();
		if(coll.error){
			throw new Error(coll.error);
		}
		this.coll = this.coll.concat(coll.data);
		this.cant = this.coll.length;
	} catch (error) {
		alert(error);
		console.log(error);
	}
	this.parent.loader.active = false;
}

roles.prototype.getCollectionView = function() {
	if (!this.filterText) return this.coll;
  const filter = this.filterText.toLowerCase();
  return this.coll.filter(row => 
    (row.nombre && row.nombre.toLowerCase().includes(filter)) || 
    (row.descripcion && row.descripcion.toLowerCase().includes(filter))
  );
}

roles.prototype.create = async function() {
	try {
    const nombre = await this.parent.prompt.execute('Nuevo Rol', 'text', 'Ingrese el nombre del rol (identificador)', "");
    if (!nombre || nombre.trim() === '') return;

    const descripcion = await this.parent.prompt.execute('Descripción', 'text', 'Ingrese una breve descripción', "");
		
		this.parent.loader.active = true;
		const result = await this.services.create({}, {
			nombre: nombre.trim(),
			descripcion: (descripcion || "").trim()
		});
		
		if(result.error){
			throw new Error(result.error);
		}
		
		this.refresh();
	} catch (error) {
		alert(error);
		console.log(error);
	}
  this.parent.loader.active = false;
}

roles.prototype.update = async function(row) {
	try {
    
    const nombre = await this.parent.prompt.execute('Editar Nombre', 'text', 'Actualice el nombre del rol', row.nombre);
    if (!nombre || nombre.trim() === '') return;

    const descripcion = await this.parent.prompt.execute('Editar Descripción', 'text', 'Actualice la descripción', row.descripcion);
		
		this.parent.loader.active = true;
    
		const result = await this.services.update({ id: row.id }, {
			nombre: nombre.trim(),
			descripcion: (descripcion || "").trim()
		});
		
		if(result.error){
			throw new Error(result.error);
		}
		
		this.refresh();
    
	} catch (error) {
		alert(error);
		console.log(error);
	}
  this.parent.loader.active = false;
}

roles.prototype.delete = async function(id) {
	try {
    
    const confirmar = await this.parent.modal.confirm('¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		const del = await this.services.delete({ id: id });
		if(del.error){
			throw new Error(del.error);
		}
		this.refresh();
	} catch (error) {
		alert(error);
		console.log(error);
	}
	this.parent.loader.active = false;
}

roles.prototype.getLinkDatabase = function (id) {
	return this.host_database?.host ? `${this.host_database.host}/objetos/roles/${id}` : '';
}


app.modules.roles = roles;