"use strict";

const constants  = require('../constants');

constants.error.rest = {
  create: 'Error al crear usuario',
  createEmailExiste: 'El email ingresado ya existe',
  createNOCAN: 'Esta instancia no permite creación de usuarios',
  read: 'Error al obtener usuario',
  update: 'Error al actualizar usuario',
  delete: 'Error al eliminar usuario'
}

module.exports = constants;