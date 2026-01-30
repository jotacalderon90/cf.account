'use strict';

const { z } = require('zod');

module.exports = {
  
  googleoauthcallback: z.object({
    code: z
      .string()
      .trim()
  }), 
  
  send: z.object({
    raw: z
      .string()
      .trim()
  })
  
}