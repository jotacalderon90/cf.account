'use strict';

const constants  = require('../constants');

constants.error.rest.tracking = 'Error al generar tracking';
constants.error.rest.count = 'Error al obtener total de usuarios';
constants.error.rest.collection = 'Error al obtener lista de usuarios';
constants.error.rest.tag = 'Error al obtener tags de usuarios';
constants.error.rest.createadmin = 'Error al crear usuario administrador';
constants.error.rest.createadminexists = 'email ingresado ya existe';
constants.error.rest.createbyadmin = 'Error al crear usuario';
constants.error.rest.updatebyadmin = 'Error al actualizar usuario';
constants.error.rest.deletebyadmin = 'Error al eliminar usuario';

constants.messages.createadmin = {
  h1: 'Cuenta administrador',
  p: 'Se ha creado el usuario administrador de manera correcta'
}

module.exports = constants;