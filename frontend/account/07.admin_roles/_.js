const object = function() {
	this.name = 'roles';
	this.services = {
		total: createService('GET', '/api/admin/' + this.name + '/total'),
		collection: createService('GET', '/api/admin/' + this.name + '/collection?skip=:skip'),
		create: createService('POST', '/api/admin/' + this.name),
		update: createService('PUT', '/api/admin/' + this.name + '/:id'),
		delete: createService('DELETE', '/api/admin/' + this.name + '/:id')
	}

	this.coll = [];
  this.filterText = '';
}

object.prototype.start = async function(parent){
	this.parent = parent;
	try {
		await this.refresh();
	} catch (e) {
		alert(e);
		console.log(e);
	}
}

// Propiedad computada simulada para filtrado local en Vue
Object.defineProperty(object.prototype, 'filteredColl', {
  get: function() {
    if (!this.filterText) return this.coll;
    const filter = this.filterText.toLowerCase();
    return this.coll.filter(row => 
      (row.nombre && row.nombre.toLowerCase().includes(filter)) || 
      (row.descripcion && row.descripcion.toLowerCase().includes(filter))
    );
  }
});

object.prototype.hasRole = function(role){
	return roles.indexOf(role) > -1;
}

object.prototype.refresh = async function() {
	this.cant = 0;
	this.obtained = 0;
	this.coll = [];
	await this.getTotal();
}

object.prototype.getTotal = async function() {
	try {
		const cant = await this.services.total();
		if(cant.error){
			throw new Error(cant.error);
		}
		this.cant = cant.data;
		await this.getCollection();
	} catch (e) {
		alert(e);
		console.log(e);
	}
}

object.prototype.getCollection = async function() {
	this.parent.loader.active = true;
	try {
		const coll = await this.services.collection({skip: this.obtained});
		if(coll.error){
			throw(coll.error);
		}
		this.coll = this.coll.concat(coll.data);
		this.obtained = this.coll.length;
	} catch (e) {
		alert(e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.delete = async function(id) {
	try {
		if (!confirm("¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.")) {
			return;
		}
		this.parent.loader.active = true;
		const del = await this.services.delete({ id: id });
		if(del.error){
			throw(del.error);
		}
		this.refresh();
	} catch (e) {
		alert(e.error || e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.create = async function() {
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
			throw(result.error);
		}
		
		this.refresh();
	} catch (e) {
		alert(e.error || e);
		console.log(e);
		this.parent.loader.active = false;
	}
}

object.prototype.edit = async function(row) {
	try {
    const nombre = await this.parent.prompt.execute('Editar Nombre', 'text', 'Actualice el nombre del rol', row.nombre);
    if (!nombre || nombre.trim() === '') return;

    const descripcion = await this.parent.prompt.execute('Editar Descripción', 'text', 'Actualice la descripción', row.descripcion);
		
		this.parent.loader.active = true;
		const result = await this.services.update({ id: row._id }, {
			nombre: nombre.trim(),
			descripcion: (descripcion || "").trim()
		});
		
		if(result.error){
			throw(result.error);
		}
		
		this.refresh();
	} catch (e) {
		alert(e.error || e);
		console.log(e);
		this.parent.loader.active = false;
	}
}

object.prototype.host_database = function() {
  return host_database + '/objetos/roles/';
}

app.modules.object = object;