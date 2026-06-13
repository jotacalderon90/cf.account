'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const request = require('cl.jotacalderon.cf.framework/lib/request');

module.exports = {
  pushOnCreate: async function (email) {
    try {
      if (process.env.HOST_PUSH) {
        request.post(
          process.env.HOST_PUSH + '/api/push/admin',
          {
            headers: {
              'x-api-key': process.env.HOST_PUSH_X_API_KEY,
              'user-agent': 'cf.account',
            },
          },
          {
            title: 'nueva cuenta',
            body: email,
          }
        );
      }
    } catch (error) {
      logger.error(error);
    }
  },

  pushOnLogin: async function (email) {
    try {
      if (process.env.HOST_PUSH) {
        request.post(
          process.env.HOST_PUSH + '/api/push/admin',
          {
            headers: {
              'x-api-key': process.env.HOST_PUSH_X_API_KEY,
              'user-agent': 'cf.account',
            },
          },
          {
            title: 'Login ' + new Date().toISOString(),
            body: email,
          }
        );
      }
    } catch (error) {
      logger.error(error);
    }
  },

  mailingOnCreate: async function (email, host, hash) {
    try {
      if (process.env.HOST_MAILING) {
        const url =
          process.env.NODE_ENV === 'development'
            ? process.env.HOST_MAILING
            : 'https://' + host.replace('account', 'mailing') + '/api/mailing';
        request.post(
          url,
          {
            headers: {
              'x-api-key': process.env.HOST_MAILING_X_API_KEY,
              'user-agent': 'cf.account',
              origin: 'https://' + host,
            },
          },
          {
            email: email,
            subject: 'Activación de cuenta',
            template: 'account.activate.html',
            hash: 'https://' + host + '/api/account/activate/' + hash,
          }
        );
      }
    } catch (error) {
      logger.error(error);
    }
  },

  mailingOnForget: async function (email, host, hash) {
    try {
      if (process.env.HOST_MAILING) {
        const url =
          process.env.NODE_ENV === 'development'
            ? process.env.HOST_MAILING
            : 'https://' + host.replace('account', 'mailing');
        const _hash = process.env.NODE_ENV === 'development' ? process.env.HOST : 'https://' + host;

        request.post(
          url + '/api/mailing',
          {
            headers: {
              'x-api-key': process.env.HOST_MAILING_X_API_KEY,
              'user-agent': 'cf.account',
              origin: 'https://' + host,
            },
          },
          {
            email: email,
            subject: 'Reestablecer contraseña',
            template: 'account.recovery.html',
            hash: _hash + '/recovery?hash=' + hash,
          }
        );
      }
    } catch (error) {
      logger.error(error);
    }
  },
};
