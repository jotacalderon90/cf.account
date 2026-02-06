'use strict';

const { z } = require('zod');

module.exports = {
  
  count: z.object({
    roles: z
      .string()
      .trim()
      .optional()
  }),
  
  collection: z.object({
    roles: z
      .string()
      .trim()
      .optional(),
    skip: z
      .string()
      .transform(Number)
      .pipe(z.number().int().min(0)),
  }),
  
  createadmin: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase(),
    password: z
      .string()
  }),
  
  updatebyadmin_roles: z.object({
    roles: z
      .array(z.string())
      .nonempty('El array no puede estar vacío')
  }),
  
  updatebyadmin_activate: z.object({
    activate: z
      .boolean()
      .default(true)
  }),
  
  updatebyadmin_password: z.object({
    password: z
      .string()
  }),
  
  deletebyadmin: z.object({
    id: z
      .string()
      .trim()
  }),
  
}