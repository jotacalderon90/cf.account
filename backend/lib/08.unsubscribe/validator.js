'use strict';

const { z } = require('zod');

module.exports = {
  unsubscribe: z.object({
    hash: z.string().regex(/^[a-f0-9]{64}$/i),
  }),
};
