'use strict';

const { z } = require('zod');

module.exports = {
  
  renderRecovery: z.object({
    hash: z
      .string()
      .trim()
  })
  
}