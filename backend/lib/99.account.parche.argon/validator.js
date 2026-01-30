'use strict';

const { z } = require('zod');

module.exports = {
  
  parcheargon: z.object({
    password: z
      .string()
      .trim()
  })
  
}