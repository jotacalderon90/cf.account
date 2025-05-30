const object = function() {
	this.name = 'account';
	this.query = {};
	this.options = {
		projection: {
			email: 1,
			roles: 1,
			activate: 1
		},
		sort: {
			created: -1
		}
	};
	//this.services = document.helper.createServices('/api/admin/' + this.name);
	this.services = {
		total: createService('GET', '/api/admin/' + this.name + '/total?query=:query'),
		collection: createService('GET', '/api/admin/' + this.name + '/collection?query=:query&options=:options'),
		tag: createService('GET', '/api/admin/' + this.name + '/tag/collection'),
		create: createService('POST', '/api/admin/' + this.name),
		update: createService('PUT', '/api/admin/' + this.name + '/:id'),
		delete: createService('DELETE', '/api/admin/' + this.name + '/:id'),
		tag: createService('GET', '/api/admin/' + this.name + '/tag/collection')
	}

	this.scroller = '#account_modal_admin .modal-content';
	$(this.scroller).scroll(() => {
		const p = $(this.scroller)[0].scrollHeight - $(document).height();
		if (($(this.scroller).scrollTop() * 100) / p >= 99) {
			if (this.obtained < this.cant && !this.obtaining) {
				this.getCollection();
			}
		}
	});
	
	this.coll = [];
}

object.prototype.start = async function(parent){
	this.parent = parent;
	try {
		const tags = await this.services.tag();
		if(tags.error){
			throw(tags.error);
		}
		this.tags = tags.data;
		await this.refresh();
	} catch (e) {
		alert(e);
		console.log(e);
	}
}

object.prototype.refresh = async function(roles) {
	if (roles) {
		this.query.roles = roles;
	} else {
		delete this.query.roles;
	}
	this.cant = 0;
	this.obtained = 0;
	this.coll = [];
	await this.getTotal();
}

object.prototype.getTotal = async function() {
	try {
		const cant = await this.services.total(this.paramsToGetTotal());
		if(cant.error){
			throw(cant.error);
		}
		this.cant = cant.data;
		this.getCollection();
	} catch (e) {
		alert(e);
		console.log(e);
	}
}

object.prototype.paramsToGetTotal = function() {
	return {
		query: JSON.stringify(this.query)
	};
}

object.prototype.getCollection = async function() {
	this.parent.loader.active = true;
	try {
		this.obtaining = true;

		const coll = await this.services.collection(this.paramsToGetCollection());
		if(coll.error){
			throw(coll.error);
		}
		this.coll = this.coll.concat(coll.data);
		this.obtained = this.coll.length;
		this.obtaining = false;
	} catch (e) {
		alert(e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.paramsToGetCollection = function() {
	return {
		query: JSON.stringify(this.query),
		options: JSON.stringify(this.getOptions())
	};
}

object.prototype.getOptions = function() {
	return {
		...this.options,
		skip: this.obtained,
		limit: 50
	};
}

object.prototype.changeRoles = async function(row) {
	try {
		console.log(this.parent);
		const newroles = await this.parent.prompt.execute('Actualizar roles', 'text', 'Ingrese roles separados por coma', row.roles.join(','));
		if (newroles.trim() == '') {
			return;
		}
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: row._id
		}, {
			type: 'roles',
			roles: newroles.split(',')
		});
		if(update.error){
			throw(update.error);
		}
		alert("Documento actualizado correctamente");
		this.refresh();
	} catch (e) {
		alert(e.error || e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.activate = async function(row) {
	try {
		const q = (row.activate) ? "Deshabilitar" : "Habilitar";
		if (!confirm('Confirma ' + q)) {
			return;
		}
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: row._id
		}, {
			type: 'activate'
		});
		if(update.error){
			throw(update.error);
		}
		alert("Documento actualizado correctamente");
		this.refresh();
	} catch (e) {
		alert(e.error || e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.changePassword = async function(row) {
	try {
		if (!confirm('Confirma querer cambiar contraseña')) {
			return;
		}
		const newpassword = await this.parent.prompt.execute('Cambiar contraseña', 'password', 'Ingrese nueva contraseña...', '');
		if (newpassword.trim() == '') {
			return;
		}
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: row._id
		}, {
			type: 'password',
			password: newpassword
		});
		if(update.error){
			throw(update.error);
		}
		alert("Documento actualizado correctamente");
		this.refresh();
	} catch (e) {
		alert(e.error || e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.enableRecovery = async function(row) {
	try {
		if (!confirm('Confirma enviar correo de recuperación')) {
			return;
		}
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: row._id
		}, {
			type: 'notify'
		});
		if(update.error){
			throw(update.error);
		}
		alert("Notificacion enviada correctamente");
	} catch (e) {
		alert(e.error || e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.delete = async function(id) {
	try {
		if (!confirm("Confirme eliminación del documento")) {
			return;
		}
		this.parent.loader.active = true;
		const del = await this.services.delete({
			id: id || this.doc._id
		});
		if(del.error){
			throw(del.error);
		}
		alert("Documento eliminado correctamente");
		this.refresh();
	} catch (e) {
		alert(e.error || e);
		console.log(e);
	}
	this.parent.loader.active = false;
}

object.prototype.create = async function(id) {
	try {
		
		const email = await this.parent.prompt.execute('Nuevo usuario', 'text', 'Ingrese email', "");
		if (email.trim() == '') {
			return;
		}
		
		await wait(500);
		
		const password = await this.parent.prompt.execute('Ingrese password', 'text', 'Ingrese password', email);
		if (password.trim() == '') {
			return;
		}
		
		if (!confirm("Confirme creación del documento")) {
			return;
		}
		
		this.parent.loader.active = true;
		const service = await this.services.create({}, {
			email: email,
			password: password
		});
		
		if(service.error){
			throw(service.error);
		}
		
		alert("Documento creado correctamente");
		this.refresh();
		
	} catch (e) {
		alert(e.error || e);
		console.log(e);
		this.parent.loader.active = false;
	}
}

app.modules.object = object;