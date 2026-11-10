'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.googleoauthcallback = 'Error al ejecutar googleoauth callback';
_constants.error.rest.googleoauthcallbackNotFound = 'No se encontró la configuración oauth2 de google';

module.exports = _constants;
