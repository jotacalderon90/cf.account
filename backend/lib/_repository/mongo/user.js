'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

const constants = require('../constants');

//20260505:formateo registro mongo para normalizacion
const mapRow = function (row) {
  row.id = row._id.toString();
  return row;
};

module.exports = {
  total: async function (query) {
    try {
      const total = await mongodb.count('user', query);

      if (isNaN(total)) {
        throw new Error(total);
      }

      return total;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.repositorio);
    }
  },

  collection: async function (query, options) {
    try {
      const collection = await mongodb.find('user', query, options);

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
      if ((await this.total({ email: input.email, host: input.host })) != 0) {
        return constants.error.rest.createEmailExiste;
      }

      const nuevoUsuario = {};

      nuevoUsuario.host = input.host;
      nuevoUsuario.email = input.email;
      nuevoUsuario.hash = input.hash;
      nuevoUsuario.password = input.password;
      nuevoUsuario.nickname = input.nickname;
      nuevoUsuario.thumb = input.thumb;
      nuevoUsuario.activate = input.activate;
      nuevoUsuario.roles = input.roles;
      nuevoUsuario.notification = input.notification;
      nuevoUsuario.created = new Date();

      const created = await mongodb.insertOne('user', nuevoUsuario);

      if (!created.acknowledged) {
        throw new Error(created);
      }

      return created.insertedId.toString();
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.repositorio);
    }
  },

  read: async function (id) {
    try {
      const doc = await mongodb.findOne('user', id);

      if (!doc._id) {
        throw new Error(doc);
      }

      return mapRow(doc);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },

  update: async function (input, id) {
    try {
      const updated = await mongodb.updateOne('user', id, { $set: input });

      if (!updated.acknowledged) {
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
      const deleted = await mongodb.deleteOne('user', id);

      if (!deleted.acknowledged) {
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
      const query = {
        host: input.host,
      };

      if (input.roles) {
        query.roles = input.roles;
      }

      const options = {
        projection: {
          email: 1,
          roles: 1,
          activate: 1,
        },
        sort: {
          created: -1,
        },
        limit: constants.paginator,
        skip: input.skip,
      };

      return await this.collection(query, options);
    } catch (error) {
      logger.error(error);
      throw new Error(
        constants.error.rest.findToTablePaginator + ' ' + constants.error.repositorio
      );
    }
  },
};
