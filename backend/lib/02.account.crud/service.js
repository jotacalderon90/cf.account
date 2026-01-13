"use strict";

const path = require('path');
const logger = require('cl.jotacalderon.cf.framework/lib/log')(path.basename(__filename));

const constants = require('./constants');
const repository = require('./repository');

module.exports = {
  
  create: async function(input) {
    try {
      
      const validaexiste_articulo_traspaso_x_id_articulo = await repository.validaexiste_articulo_traspaso_x_id_articulo(input);
      
			if(validaexiste_articulo_traspaso_x_id_articulo > 0){
				return 1;
			}
      
      const validaexiste_cod_art_x_id_articulo = await repository.validaexiste_cod_art_x_id_articulo(input);
      if(validaexiste_cod_art_x_id_articulo.length == 0) {
        throw new Error(`No se encontró el artículo con ID ${input.id_articulo}`);
      }
      
      const validaexiste_id_articulo_otrasucursal = await repository.validaexiste_id_articulo_otrasucursal({
        ...input, 
        cod_art: validaexiste_cod_art_x_id_articulo[0].COD_ART
      });
      if(validaexiste_id_articulo_otrasucursal.length == 0) {
        throw new Error(`No se encontró el artículo en la otra sucursal con CÓD_ART ${validaexiste_cod_art_x_id_articulo[0].COD_ART}`);
      }
      
      const validaexiste_articulo_traspaso_x_id_articulo2 = await repository.validaexiste_articulo_traspaso_x_id_articulo({
        id_articulo: validaexiste_id_articulo_otrasucursal[0].ID_ARTICULO
      });
      
      if(validaexiste_articulo_traspaso_x_id_articulo2 > 0){
        return 2;
      }
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },
  
  delete: async function(id) {
    try {
      
      const deleted = await repository.delete(id);
      logger.info(deleted);
      
      return true;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.delete + ' ' + constants.error.servicio);
    }
  }
  
}