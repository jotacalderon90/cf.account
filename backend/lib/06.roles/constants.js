'use strict';

const constants = require('../constants');

const _constants = { ...constants };

_constants.error.rest.total = 'Error al obtener total de roles';
_constants.error.rest.collection = 'Error al obtener lista de roles';
_constants.error.rest.create = 'Error al crear rol';
_constants.error.rest.read = 'Error al obtener rol';
_constants.error.rest.read_inhost = 'El rol no pertenece al host :|';
_constants.error.rest.update = 'Error al actualizar rol';
_constants.error.rest.delete = 'Error al eliminar rol';

module.exports = _constants;
