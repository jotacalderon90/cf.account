'use strict';

const { z } = require('zod');

module.exports = {
  create: z.object({
    nombre: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres'),
    descripcion: z.string().trim().optional().or(z.literal('')),
  }),

  update: z.object({
    nombre: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .optional(),
    descripcion: z.string().trim().optional().or(z.literal('')),
  }),
};
