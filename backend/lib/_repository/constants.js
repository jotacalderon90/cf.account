'use strict';

const constants = require('../constants');

constants.error.rest.total = 'Error al obtener total';
constants.error.rest.collection = 'Error al buscar';

constants.error.rest.create = 'Error al crear';
constants.error.rest.read = 'Error al leer';
constants.error.rest.update = 'Error al actualizar';
constants.error.rest.delete = 'Error al eliminar';

constants.error.rest.createEmailExiste = 'Error al crear email existente';

constants.error.rest.findByEmail = 'Error al obtener usuario por email';
constants.error.rest.manyUsersByEmail = 'Usuarios con mismo email';
constants.error.rest.findToTablePaginator = 'Error al obtener usuarios para paginador';

module.exports = constants;
