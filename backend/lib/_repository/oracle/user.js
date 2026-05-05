'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const oracle = require('cl.jotacalderon.cf.framework/lib/oracle');
const oracledb = require('oracledb');

const constants = require('../constants');

//20260505:convierto atributos a minuscula
const toLowerKeys = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});

//20260505:formateo registro oracle para normalizacion
const mapRow = function (row) {
  row.ROLES = row.ROLES.split(',');
  row.ACTIVATE = row.ACTIVATE == 1 ? true : false;
  return toLowerKeys(row);
};

module.exports = {
  total: async function (query) {
    try {
      let sql = `
        SELECT 
          COUNT(*) AS TOTAL
        FROM USUARIOS
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
          EMAIL,
          HASH,
          PASSWORD,
          NICKNAME,
          ACTIVATE,
          ROLES
        FROM USUARIOS
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

      return collection.map(mapRow);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  create: async function (input) {
    try {
      // Verificar si el email ya existe
      const sqlCheck = `
        SELECT COUNT(*) AS TOTAL
        FROM USUARIOS
        WHERE EMAIL = :email
      `;
      const check = await oracle.select(sqlCheck, { email: input.email });

      if (check[0].TOTAL != 0) {
        return constants.error.rest.createEmailExiste;
      }

      const sql = `
        INSERT INTO USUARIOS (
          EMAIL,
          PASSWORD,
          NICKNAME,
          ACTIVATE,
          ROLES
        ) VALUES (
          :email,
          :password,
          :nickname,
          :activate,
          :roles
        )
        RETURNING ID INTO :id
      `;

      const created = await oracle.execute(sql, {
        email: input.email,
        password: input.password,
        nickname: input.nickname,
        activate: input.activate ? 1 : 0,
        roles: input.roles.join(','),
        id: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
      });

      if (created.rowsAffected != 1) {
        throw new Error(created);
      }

      return created.outBinds.id[0].toString();
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
          EMAIL,
          HASH,
          PASSWORD,
          NICKNAME,
          ACTIVATE,
          ROLES
        FROM USUARIOS
        WHERE ID = :id
      `;

      const readed = await oracle.select(sql, { id: id });

      if (readed.length == 0) {
        throw new Error(constants.error.rest.read);
      }

      return mapRow(readed[0]);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },

  update: async function (input, id) {
    try {
      let sql;
      let params;

      if (input.roles != undefined) {
        sql = `
          UPDATE USUARIOS SET
            ROLES    = :roles
          WHERE ID = :id
        `;

        params = {
          roles: input.roles.join(','),
        };
      }

      if (input.activate != undefined) {
        sql = `
          UPDATE USUARIOS SET
            ACTIVATE = :activate
          WHERE ID = :id
        `;

        params = {
          activate: input.activate ? 1 : 0,
        };
      }

      if (input.password != undefined) {
        sql = `
          UPDATE USUARIOS SET
            PASSWORD = :password
          WHERE ID = :id
        `;

        params = {
          password: input.password,
        };
      }

      const updated = await oracle.execute(sql, { ...params, id });

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
        DELETE FROM USUARIOS
        WHERE ID = :id
      `;

      const deleted = await oracle.execute(sql, { id: id });

      if (deleted.rowsAffected != 1) {
        throw new Error(deleted);
      }

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.repositorio);
    }
  },

  findByEmail: async function (email) {
    try {
      const sql = `
        SELECT * 
        FROM USUARIOS
        WHERE
          EMAIL = :email
      `;

      const collection = await oracle.select(sql, { email: email });

      if (collection.length == 0) {
        return null;
      }

      return mapRow(collection[0]);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.findByEmail + ' ' + constants.error.repositorio);
    }
  },

  findToTablePaginator: async function (input) {
    try {
      const sql = `
        SELECT
          ID,
          EMAIL,
          ACTIVATE,
          ROLES
        FROM USUARIOS
        OFFSET :skip ROWS FETCH NEXT ${constants.paginator} ROWS ONLY
      `;

      const collection = await oracle.select(sql, { skip: input.skip });

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection.map(mapRow);
    } catch (error) {
      logger.error(error);
      throw new Error(
        constants.error.rest.findToTablePaginator + ' ' + constants.error.repositorio
      );
    }
  },
};
