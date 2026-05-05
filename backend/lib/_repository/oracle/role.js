'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const oracle = require('cl.jotacalderon.cf.framework/lib/oracle');
const oracledb = require('oracledb');

const constants = require('../constants');

const toLowerKeys = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});

module.exports = {
  total: async function (query) {
    try {
      let sql = `
        SELECT 
          COUNT(*) AS TOTAL
        FROM ROLES
        WHERE
          1 = 1
      `;

      for (let attr in query) {
        sql += ` AND ${attr} = ${query[attr]}`;
      }

      const total = await oracle.select(sql);

      if (isNaN(total[0].TOTAL)) {
        throw new Error(total);
      }

      return total[0].TOTAL;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.repositorio);
    }
  },

  collection: async function (query) {
    try {
      let sql = `
        SELECT 
          ID,
          NOMBRE, 
          DESCRIPCION
        FROM ROLES
        WHERE
          1 = 1
      `;

      for (let attr in query) {
        sql += ` AND ${attr} = ${query[attr]}`;
      }

      const collection = await oracle.select(sql);

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection.map((row) => {
        return toLowerKeys(row);
      });
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  create: async function (input) {
    try {
      const sql = `
        INSERT INTO ROLES ( 
          NOMBRE, 
          DESCRIPCION
        ) VALUES (
          :nombre, 
          :descripcion
        )
        RETURNING ID INTO :id
      `;

      const created = await oracle.execute(sql, {
        nombre: input.nombre,
        descripcion: input.descripcion,
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
          DESCRIPCION
        FROM ROLES
        WHERE 
          ID = :id
      `;

      const doc = await oracle.select(sql, {
        id: id,
      });

      if (doc.length == 0) {
        throw new Error(doc);
      }

      return toLowerKeys(doc[0]);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },

  update: async function (input, id) {
    try {
      const sql = `
        UPDATE ROLES SET 
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
        DELETE FROM ROLES
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
