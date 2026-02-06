'use strict';

const { z } = require('zod');

const password = require('../password');

module.exports = {
  
  create: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine(
        (val) => !val || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val),
        { message: 'El formato del email no es válido' }
      ),
    password: z
      .string()
      .refine(
        (val) => password.isValid(val),
        {
          message: 'La contraseña no cumple con los requisitos de seguridad'
        }
      )
      .optional()
      .or(z.literal(''))
  }),
  
  update: z.object({
    nickname: z
      .string()
      .min(3, 'El nickname debe tener al menos 3 caracteres')
      .max(20, 'El nickname no puede exceder 20 caracteres')
      .regex(
        /^[a-zA-Z0-9_@.-]+$/,
        'El nickname solo puede contener letras, números, guiones y guiones bajos'
      )
      .trim(),
    password: z
      .string()
      .refine(
        (val) => password.isValid(val),
        {
          message: 'La contraseña no cumple con los requisitos de seguridad'
        }
      )
      .optional()
      .or(z.literal('')),
    button: z
      .enum(['UPDATE'])
  }),
  
  activate: z.object({
    hash: z
      .string()
      .trim()
  }),
  
  forget: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine(
        (val) => !val || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val),
        { message: 'El formato del email no es válido' }
      )
  }),
  
  recovery: z.object({
    hash: z
      .string()
      .trim(),
    password: z
      .string()
      .refine(
        (val) => password.isValid(val),
        {
          message: 'La contraseña no cumple con los requisitos de seguridad'
        }
      )
      .optional()
      .or(z.literal('')),
    password2: z
      .string()
      .refine(
        (val) => password.isValid(val),
        {
          message: 'La contraseña no cumple con los requisitos de seguridad'
        }
      )
      .optional()
      .or(z.literal(''))
  }),
  
  login: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase(),
    password: z
      .string(),
    jwt: z
      .boolean()
      .optional()
  })
  
  
}