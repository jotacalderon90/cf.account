'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.googleoauthcallback = 'Error al ejecutar googleoauth callback';

module.exports = _constants;
