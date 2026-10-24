'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const oracle = require('cl.jotacalderon.cf.framework/lib/oracle');
const oracledb = require('oracledb');
//const AppError = require('../../error');

const constants = require('../constants');

const mapRow = function (row) {
  return Object.entries(row).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});
};

const name_collection = 'ROLES';

module.exports = {
  total: async function (query) {
    try {
      let sql = `
        SELECT 
          COUNT(*) AS TOTAL
        FROM ${name_collection}
        WHERE
          1 = 1
      `;

      const clauses = [];
      const params = {};

      for (const [column, rawValue] of Object.entries(query)) {
        if (!['number', 'string', 'boolean'].includes(typeof rawValue)) {
          throw new TypeError(`Columna "${column}": tipo "${typeof rawValue}" no soportado`);
        }
        clauses.push(`${column} = :${column}`);
        params[column] = rawValue;
      }

      if (clauses.length) sql += ` AND ${clauses.join(' AND ')}`;

      const total = await oracle.select(sql, params);

      if (isNaN(total[0].TOTAL)) {
        throw new Error(total);
      }

      return total[0].TOTAL;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.repositorio);
    }
  },

  collection: async function (query, options) {
    try {
      let sql = `
        SELECT 
          ID,
          NOMBRE, 
          DESCRIPCION
        FROM ${name_collection}
        WHERE
          1 = 1
      `;

      const clauses = [];
      const params = {};

      for (const [column, rawValue] of Object.entries(query)) {
        if (!['number', 'string', 'boolean'].includes(typeof rawValue)) {
          throw new TypeError(`Columna "${column}": tipo "${typeof rawValue}" no soportado`);
        }
        clauses.push(`${column} = :${column}`);
        params[column] = rawValue;
      }

      if (clauses.length) sql += ` AND ${clauses.join(' AND ')}`;

      if (options) {
        sql += ` ${options} `;
      }

      const collection = await oracle.select(sql, params);

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection.map(mapRow);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  tags: async function () {
    try {
      throw new Error('No implementado');
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.tags + ' ' + constants.error.repositorio);
    }
  },

  create: async function (input) {
    try {
      const sql = `
        INSERT INTO ${name_collection} ( 
          NOMBRE, 
          DESCRIPCION,
          HOST
        ) VALUES (
          :nombre, 
          :descripcion,
          :host
        )
        RETURNING ID INTO :id
      `;

      const created = await oracle.execute(sql, {
        nombre: input.nombre,
        descripcion: input.descripcion,
        host: input.host,
        id: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
      });

      if (created.rowsAffected != 1) {
        throw new Error(created);
      }

      return created.outBinds.id[0];
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.repositorio);
    }
  },

  read: async function (id) {
    try {
      const sql = `
        SELECT  
          ID,
          NOMBRE, 
          DESCRIPCION,
          HOST
        FROM ${name_collection}
        WHERE 
          ID = :id
      `;

      const doc = await oracle.select(sql, {
        id: id,
      });

      if (doc.length == 0) {
        throw new Error(doc);
      }

      return mapRow(doc[0]);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },

  update: async function (id, input) {
    try {
      const sql = `
        UPDATE ${name_collection} SET 
          NOMBRE = :nombre, 
          DESCRIPCION = :descripcion
        WHERE 
          ID = :id
      `;

      const updated = await oracle.execute(sql, {
        nombre: input.nombre,
        descripcion: input.descripcion,
        id: id,
      });

      if (updated.rowsAffected != 1) {
        throw new Error(updated);
      }

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.repositorio);
    }
  },

  delete: async function (id) {
    try {
      const sql = `
        DELETE FROM ${name_collection}
        WHERE 
          ID = :id
      `;

      const deleted = await oracle.execute(sql, {
        id: id,
      });

      if (deleted.rowsAffected != 1) {
        throw new Error(deleted);
      }

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.repositorio);
    }
  },
};
