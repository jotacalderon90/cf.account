'use strict';

const { z } = require('zod');

module.exports = {
  unsubscribe: z.object({
    hash: z.string(),
  }),
};
