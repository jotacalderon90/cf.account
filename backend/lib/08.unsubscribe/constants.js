'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.unsubscribe = 'Error al eliminar subscripción :S';
_constants.error.rest.unsubscribe_notFound = 'No se encontró usuario para eliminar subscripción :|';

module.exports = _constants;
