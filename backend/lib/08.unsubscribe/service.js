'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const { user } = require('../_repository/_');

const unsubscribe = require('../unsubscribe');

module.exports = {
  unsubscribe: async function (input) {
    try {
      const email = unsubscribe.decrypt(input.hash);

      const userByEmail = await user.findByEmail(email, input.host);

      if (userByEmail == null) {
        return constants.error.rest.unsubscribe_notFound;
      }

      const set = {
        notification: false,
      };

      return await user.update(userByEmail.id, set);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.unsubscribe + ' ' + constants.error.servicio);
    }
  },
};
