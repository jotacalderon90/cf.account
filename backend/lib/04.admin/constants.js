'use strict';

const constants = require('../constants');

const _constants = { ...constants };

_constants.error.rest.tracking = 'Error al generar tracking';
_constants.error.rest.total = 'Error al obtener total de usuarios';
_constants.error.rest.collection = 'Error al obtener lista de usuarios';
_constants.error.rest.createadmin = 'Error al crear usuario administrador';
_constants.error.rest.createadminexists = 'email ingresado ya existe';
_constants.error.rest.createbyadmin = 'Error al crear usuario';
_constants.error.rest.updatebyadmin = 'Error al actualizar usuario';
_constants.error.rest.updatebyadmin_userinhost = 'El usuario no pertenece al host :|';
_constants.error.rest.deletebyadmin = 'Error al eliminar usuario';

_constants.messages.createadmin = {
  h1: 'Cuenta administrador',
  p: 'Se ha creado el usuario administrador de manera correcta',
};

module.exports = _constants;
