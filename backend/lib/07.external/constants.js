'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.mailingSubscritos = 'Error al obtener mail de usuarios subscritos a mailing';

module.exports = _constants;
