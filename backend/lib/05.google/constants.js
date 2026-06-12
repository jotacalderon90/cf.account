'use strict';

const constants = require('../constants');

const _constants = { ...constants };

_constants.error.rest.googleoauth = 'Error al ejecutar googleoauth';
_constants.error.rest.googleoauthcallback = 'Error al ejecutar googleoauth callback';
_constants.error.rest.send = 'Error al generar enviar correo por google';

module.exports = _constants;
