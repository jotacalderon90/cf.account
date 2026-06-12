'use strict';

const constants = require('../constants');

const _constants = { ...constants };

_constants.error.rest.collection = 'Error al buscar usuarios';

_constants.error.rest.create = 'Error al crear usuario';
_constants.error.rest.createEmailExiste = 'El email ingresado ya existe';
_constants.error.rest.createNOCAN = 'Esta instancia no permite creación de usuarios';

_constants.error.rest.read = 'Error al obtener usuario';
_constants.error.rest.update = 'Error al actualizar usuario';
_constants.error.rest.delete = 'Error al eliminar usuario';

_constants.error.rest.activate = 'Error al activar cuenta de usuario';

_constants.error.rest.forget = 'Error al intentar recuperar contraseña';
_constants.error.rest.forgetNoUser = 'Error al obtener usuario asociado';

_constants.error.rest.recovery = 'Error al recuperar contraseña';
_constants.error.rest.recoveryNOCAN = 'Esta instancia no permite recuperar contraseñas de usuarios';

_constants.error.rest.login = 'Error al ingresar sesión';
_constants.error.rest.login_desactivate = 'Usuario no esta activo';

_constants.error.rest.logout = 'Error al cerrar sesión';

module.exports = _constants;
