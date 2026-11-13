'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.microsoftoauthcallback = 'Error al ejecutar microsoft oauth callback';
_constants.error.rest.microsoftoauthcallbackNotFound = 'No se encontró la configuración oauth2 de microsoft';

module.exports = _constants;
