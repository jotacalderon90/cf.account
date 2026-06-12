'use strict';

const constants = require('../constants');

const _constants = { ...constants };

_constants.error.rest.renderIndex = 'Error al renderizar inicio';
_constants.error.rest.renderForm = 'Error al renderizar formulario';
_constants.error.rest.renderLogin = 'Error al renderizar login';
_constants.error.rest.renderForget = 'Error al renderizar forget';
_constants.error.rest.renderRecovery = 'Error al renderizar recovery';
_constants.error.rest.renderPoliticasPrivacidad = 'Error al renderizar políticas de privacidad';
_constants.error.rest.renderCondicionesServicio = 'Error al renderizar condiciones de servicio';
_constants.error.rest.renderAdminRoles = 'Error al renderizar administración de roles';
_constants.error.rest.renderAdminUsers = 'Error al renderizar administración de usuarios';
_constants.error.rest.renderFormAdmin = 'Error al renderizar formulario de administrador';

module.exports = _constants;
