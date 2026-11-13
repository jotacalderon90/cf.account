'use strict';

const { z } = require('zod');

module.exports = {
  microsoftoauthcallback: z.object({
    code: z.string().trim(),
  })
};
