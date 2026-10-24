'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const { user } = require('../_repository/_');

module.exports = {
  mailingSubscritos: async function (input) {
    try {
      return await user.mailingSubscritos(input.host);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.mailingSubscritos + ' ' + constants.error.servicio);
    }
  },
};
