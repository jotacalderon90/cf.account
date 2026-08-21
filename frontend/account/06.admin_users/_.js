const users = function () {
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
		total: createService('GET', '/api/admin/' + this.name + '/total?roles=:roles'),
		collection: createService('GET', '/api/admin/' + this.name + '/collection?roles=:roles&skip=:skip'),
		tag: createService('GET', '/api/admin/' + this.name + '/tag/collection'),
		create: createService('POST', '/api/admin/' + this.name),
		update: createService('PUT', '/api/admin/' + this.name + '/:id'),
		delete: createService('DELETE', '/api/admin/' + this.name + '/:id'),
		tag: createService('GET', '/api/admin/roles/collection'),
		roles: createService('GET', '/api/admin/roles/collection')
	}

	this.coll = [];
	this.allRoles = [];
	this.selectedUser = null;
	this.userRoles = [];
	this.filterText = '';

	/*this.scroller = '#account_modal_admin .modal-content';
		 $(this.scroller).scroll(() => {
				 const p = $(this.scroller)[0].scrollHeight - $(document).height();
				 if (($(this.scroller).scrollTop() * 100) / p >= 99) {
						 if (this.obtained < this.cant && !this.obtaining) {
								 this.getCollection();
						 }
				 }
		 });*/
}

users.prototype.start = async function (parent) {
	this.parent = parent;
	try {
    
    this.canAdmin = this.parent.perfil.isAdmin();
    this.host_database = this.parent.menu.getHost('database');
    if (this.host_database) {
      this.can_goto_database = this.canAdmin || this.parent.perfil.hasRole(this.host_database.defaultRoles);
    }
    
		const tags = await this.services.tag();
		if (tags.error) {
			throw (tags.error);
		}
		this.tags = tags.data;
		await this.getRoles();
		await this.refresh();
	} catch (error) {
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.getRoles = async function () {
	try {
		const res = await this.services.roles({ skip: 0 }); // Assuming small enough for now, or fetch all
		if (res.error) throw res.error;
		this.allRoles = res.data;
	} catch (e) {
		console.error('Error fetching roles:', e);
	}
}

users.prototype.refresh = async function (roles) {
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

users.prototype.getTotal = async function () {
	try {
		const cant = await this.services.total(this.paramsToGetTotal());
		if (cant.error) {
			throw (cant.error);
		}
		this.cant = cant.data;
		this.getCollection();
	} catch (error) {
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.paramsToGetTotal = function () {
	/*return {
		query: JSON.stringify(this.query)
	};*/
	return {
		roles: this.query.roles || ''
	};
}

users.prototype.getCollection = async function () {
	
	try {
		this.obtaining = true;
    
    this.parent.loader.active = true;
		const coll = await this.services.collection(this.paramsToGetCollection());
    this.parent.loader.active = false;
		if (coll.error) {
			throw (coll.error);
		}
		this.coll = this.coll.concat(coll.data);
		this.obtained = this.coll.length;
		this.obtaining = false;
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.paramsToGetCollection = function () {
	return {
		roles: this.query.roles || '',
		skip: this.obtained
	};
	/*
	  return {
		  query: JSON.stringify(this.query),
		  options: JSON.stringify(this.getOptions())
	  };*/
}

users.prototype.getOptions = function () {
	return {
		...this.options,
		skip: this.obtained,
		limit: 50
	};
}

users.prototype.changeRoles = async function (row) {
	this.selectedUser = row;
	this.userRoles = [...(row.roles || [])];
	const modal = new bootstrap.Modal(document.getElementById('rolesModal'));
	modal.show();
}

users.prototype.saveRoles = async function () {
	try {
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: this.selectedUser.id
		}, {
			type: 'roles',
			roles: this.userRoles
		});
    this.parent.loader.active = false;
		if (update.error) {
			throw (update.error);
		}

		bootstrap.Modal.getInstance(document.getElementById('rolesModal')).hide();
		await this.parent.modal.notify('Roles actualizados correctamente');
		this.refresh();
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.activate = async function (row) {
	try {
		const q = (row.activate) ? 'Deshabilitar' : 'Habilitar';
		
    const confirmar = await this.parent.modal.confirm('Confirme ' + q, 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: row.id
		}, {
			type: 'activate',
			activate: !row.activate
		});
    this.parent.loader.active = false;
		if (update.error) {
			throw (update.error);
		}
		await this.parent.modal.notify('Documento actualizado correctamente');
		this.refresh();
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.changePassword = async function (row) {
	try {
    
    const confirmar = await this.parent.modal.confirm('Confirma querer cambiar contraseña', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		const newpassword = await this.parent.modal.prompt('Cambiar contraseña', 'password', 'Ingrese nueva contraseña...', '');
		if (newpassword.trim() == '') {
			return;
		}
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: row.id
		}, {
			type: 'password',
			password: newpassword
		});
    this.parent.loader.active = false;
		if (update.error) {
			throw (update.error);
		}
		await this.parent.modal.notify('Documento actualizado correctamente');
		this.refresh();
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.enableRecovery = async function (row) {
	try {
    
    const confirmar = await this.parent.modal.confirm('Confirma enviar correo de recuperación', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		const update = await this.services.update({
			id: row.id
		}, {
			type: 'notify'
		});
    this.parent.loader.active = false;
		if (update.error) {
			throw (update.error);
		}
		await this.parent.modal.notify('Notificacion enviada correctamente');
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.delete = async function (id) {
	try {
    
    const confirmar = await this.parent.modal.confirm('Confirme eliminación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		const del = await this.services.delete({
			id: id || this.doc.id
		});
    this.parent.loader.active = false;
		if (del.error) {
			throw (del.error);
		}
		await this.parent.modal.notify('Documento eliminado correctamente');
		this.refresh();
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.create = async function (id) {
	try {

		const email = await this.parent.modal.prompt('Nuevo usuario', 'text', 'Ingrese email', '');
		if (email.trim() == '') {
			return;
		}

		await wait(500);

		const password = await this.parent.modal.prompt('Ingrese password', 'text', 'Ingrese password', email);
		if (password.trim() == '') {
			return;
		}

    const confirmar = await this.parent.modal.confirm('Confirme creación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		const service = await this.services.create({}, {
			email: email,
			password: password
		});
    this.parent.loader.active = false;

		if (service.error) {
			throw (service.error);
		}

		await this.parent.modal.notify('Documento creado correctamente');
		this.refresh();

	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

users.prototype.getLinkDatabase = function (id) {
	return this.host_database?.host ? `${this.host_database.host}/objetos/user/${id}` : '';
}

users.prototype.getCollectionView = function (){
  if (!this.filterText) return this.coll;
  const filter = this.filterText.toLowerCase();
  return this.coll.filter(row =>
    (row.email && row.email.toLowerCase().includes(filter)) ||
    (row.roles && row.roles.some(r => r.toLowerCase().includes(filter)))
  );
};

users.prototype.copy = async function() {
  await copyLarge(this.getCollectionView().map(row => row.email).join(','));
  await this.parent.modal.notify('Correos copiados :)');
}

app.modules.users = users;