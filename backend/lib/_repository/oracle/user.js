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
          
          EMAIL,
          PASSWORD,
          ROLES,
          
          HASH,
          
          ACTIVATE,
          NOTIFICATION,
          NICKNAME,
          THUMB,
          
          CREATED
          
        FROM USUARIOS
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

  create: async function (input) {
    try {
      // Verificar si el email ya existe
      const sqlCheck = `
        SELECT 
          COUNT(*) AS TOTAL
        FROM USUARIOS
        WHERE 
          EMAIL = :email
      `;
      const check = await oracle.select(sqlCheck, { email: input.email });

      if (check[0].TOTAL != 0) {
        return constants.error.rest.createEmailExiste;
      }

      const sql = `
        INSERT INTO USUARIOS (
          
          EMAIL,
          PASSWORD,
          ROLES,
          
          HASH,
          
          ACTIVATE,
          NOTIFICATION,
          NICKNAME,
          THUMB,
          
          HOST,
          
          CREATED
          
          
        ) VALUES (
          :email,
          :password,
          :roles,
          
          :hash,
          
          :activate,
          :notification,
          :nickname,
          :thumb,
          :host,
          SYSDATE
        )
        RETURNING ID INTO :id
      `;

      const created = await oracle.execute(sql, {
        email: input.email,
        password: input.password,
        roles: input.roles.join(','),
        hash: input.hash,
        activate: input.activate ? 1 : 0,
        notification: input.notification ? 1 : 0,
        nickname: input.nickname,
        thumb: input.thumb,
        host: input.host,
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
          PASSWORD,
          ROLES,
          
          HASH,
          
          ACTIVATE,
          NOTIFICATION,
          NICKNAME,
          THUMB,
          
          HOST,
          
          CREATED
          
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
      let set = [];

      sql = `UPDATE USUARIOS SET `;

      if (input.roles != undefined) {
        set.push(`ROLES = :roles`);

        params = {
          roles: input.roles.join(','),
        };
      }

      if (input.activate != undefined) {
        set.push(`ACTIVATE = :activate`);

        params = {
          activate: input.activate ? 1 : 0,
        };
      }

      if (input.password != undefined) {
        set.push(`PASSWORD = :password`);

        params = {
          password: input.password,
        };
      }

      if (input.hash != undefined) {
        set.push(`HASH = :hash`);

        params = {
          hash: input.hash,
        };
      }

      sql += set.join(',') + ' WHERE ID = :id';

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

  inHost: async function (id, host) {
    try {
      const docById = await this.read(id);
      if (docById.host === host) {
        return true;
      }
      return false;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.inHost + ' ' + constants.error.repositorio);
    }
  },

  findByEmail: async function (email, host) {
    try {
      const collection = await this.collection({ email: email, host: host });

      if (collection.length == 0) {
        return null;
      }

      return collection[0];
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.findByEmail + ' ' + constants.error.repositorio);
    }
  },

  findByHash: async function (hash, host) {
    try {
      const collection = await this.collection({ hash: hash, host: host });

      if (collection.length == 0) {
        return null;
      }

      return collection[0];
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.findByEmail + ' ' + constants.error.repositorio);
    }
  },

  findToTablePaginator: async function (input) {
    try {
      const options = ` OFFSET ${input.skip} ROWS FETCH NEXT ${constants.paginator} ROWS ONLY `;

      const collection = await this.collection(
        {
          host: input.host,
        },
        options
      );

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection;
    } catch (error) {
      logger.error(error);
      throw new Error(
        constants.error.rest.findToTablePaginator + ' ' + constants.error.repositorio
      );
    }
  },
};
