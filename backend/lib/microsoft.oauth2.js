'use strict';

const crypto = require('crypto');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');
const redis = require('cl.jotacalderon.cf.framework/lib/redis');

const msal = require('@azure/msal-node');

const apiBase = '/api/integration';

const pathConfig = '/archivosprivados/configuraciones/microsoft-oauth2.json';
const pathEncoded = Buffer.from(pathConfig, 'utf8').toString('base64');

const getBaseURL = function(domain) {
  if (process.env.NODE_ENV === 'production' && process.env.FRONT_MULTIDOMAIN === '1') {
    return 'https://archivosprivados.' + domain;
  } else {
    return process.env.HOST_ARCHIVOSPRIVADOS;
  }
}

const getOptions = function(domain) {
  return {
    headers: {
      'user-agent': 'cf.account',
      'origin': 'account.' + domain
    }
  }
}

const SCOPES = ['openid', 'profile', 'email', 'User.Read'];

// Cache de instancias MSAL por credenciales (multitenant: una por dominio/config)
const clients = new Map();

module.exports = {
  
  getConfig: async function (domain) {
    try {
      const cacheKey = crypto.createHash('md5').update('microsoftoauth2' + domain).digest('hex');

      if (redis.client) {
        const cached = await redis.get(cacheKey);
        if (cached) return cached;
      }

      const serviceContent = await request.get(getBaseURL(domain) + `${apiBase}/get/${pathEncoded}`, getOptions(domain));
      
      if(serviceContent.data.statusCode === 200) {
        
        if (redis.client) {
          redis.set(cacheKey, serviceContent.data.body, ((60*60)*24));//ttl=1seg - 24h
        }

        return serviceContent.data.body;
      }
      
      return null;      
    } catch (error) {
      logger.error(error);
    }
    
    return null;
  },
  
  getConnection: function (config) {
    try {
      const web = config.web;
      const tenant = web.tenant_id || 'common';

      const key = crypto.createHash('md5')
        .update([web.client_id, tenant, web.client_secret].join('|'))
        .digest('hex');

      if (clients.has(key)) return clients.get(key);

      const cca = new msal.ConfidentialClientApplication({
        auth: {
          clientId: web.client_id,
          authority: `https://login.microsoftonline.com/${tenant}`,
          clientSecret: web.client_secret,
        },
      });

      clients.set(key, cca);
      return cca;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  },

  getURL: async function (domain, state) {
    try {
      const config = await this.getConfig(domain);
      if (config === null) {
        return null;
      }

      const cca = this.getConnection(config);

      return await cca.getAuthCodeUrl({
        scopes: SCOPES,
        redirectUri: config.web.redirect_uris[0],
        prompt: 'select_account',
        ...(state ? { state } : {}),
      });
    } catch (error) {
      logger.error(error);
      logger.error(domain);
    }

    return '';
  },

  getUserInfo: async function (domain, code) {
    const config = await this.getConfig(domain);
    if (config === null) {
      return null;
    }

    const cca = this.getConnection(config);

    const result = await cca.acquireTokenByCode({
      code,
      scopes: SCOPES,
      redirectUri: config.web.redirect_uris[0], // debe ser idéntico al de getURL
    });

    const c = result.idTokenClaims || {};

    return {
      // Identificador estable: usa esto, no el email, para vincular cuentas
      sub: c.tid && c.oid ? `${c.tid}.${c.oid}` : c.sub,
      oid: c.oid,
      tid: c.tid,
      email: c.email || c.preferred_username || null,
      name: c.name || null,
      given_name: c.given_name || null,
      family_name: c.family_name || null,
      claims: c, // payload completo por si lo necesitas
    };
  }
  
}