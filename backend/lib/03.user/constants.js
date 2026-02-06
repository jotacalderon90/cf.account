'use strict';

const constants  = require('../constants');

constants.error.rest.create = 'Error al crear usuario';
constants.error.rest.createEmailExiste = 'El email ingresado ya existe';
constants.error.rest.createNOCAN = 'Esta instancia no permite creación de usuarios';
constants.error.rest.read = 'Error al obtener usuario';
constants.error.rest.update = 'Error al actualizar usuario';
constants.error.rest.delete = 'Error al eliminar usuario';

constants.error.rest.activate = 'Error al activar cuenta de usuario';

constants.error.rest.forget = 'Error al intentar recuperar contraseña';
constants.error.rest.forgetNoUser = 'Error al obtener usuario asociado';
constants.error.rest.recovery = 'Error al recuperar contraseña';
constants.error.rest.recoveryNOCAN = 'Esta instancia no permite recuperar contraseñas de usuarios';

constants.error.rest.login = 'Error al ingresar sesión';
constants.error.rest.login_desactivate = 'Usuario no esta activo';
constants.error.rest.logout = 'Error al cerrar sesión';

constants.error.rest.find = 'Error al buscar usuarios';
constants.error.rest.count = 'Error al contar usuarios';

module.exports = constants;