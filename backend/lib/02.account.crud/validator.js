"use strict";

const { z } = require("zod");

module.exports = {
  
  articulos: z.object({
    sucursal: z.enum(["", "1", "2"]).optional(),
    filter: z
      .string()
      .trim()
      .transform((v) =>
        v
          .toUpperCase()
          .split(/\s+/)
          .filter(Boolean)
      )
  }),
  
  create: z.object({
    id: z
      .number()
      .int("id_orden_compra debe ser un número entero")
      .positive("id_orden_compra debe ser un número positivo"),
    id_articulo: z
      .number()
      .int("id_orden_compra debe ser un número entero")
      .positive("id_orden_compra debe ser un número positivo")
  })
  
}