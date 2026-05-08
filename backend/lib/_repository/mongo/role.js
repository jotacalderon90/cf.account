'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

const constants = require('../constants');

module.exports = {
  total: async function (query, options) {
    try {
      const total = await mongodb.count('roles', query, options);

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
      const collection = await mongodb.find('roles', query, options);

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection.map((r) => ({ ...r, id: r._id.toString() }));
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  create: async function (input) {
    try {
      const newdoc = {
        nombre: input.nombre,
        descripcion: input.descripcion,
        host: input.host,
      };

      const created = await mongodb.insertOne('roles', newdoc);

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
      const doc = await mongodb.findOne('roles', id);

      if (!doc._id) {
        throw new Error(doc);
      }

      doc.id = doc._id.toString();

      return doc;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },

  update: async function (input, id) {
    try {
      const updated = await mongodb.updateOne('roles', id, { $set: input });

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
      const deleted = await mongodb.deleteOne('roles', id);

      if (!deleted.acknowledged) {
        throw new Error(deleted);
      }

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.repositorio);
    }
  },
};
