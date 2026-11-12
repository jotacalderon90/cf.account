'use strict';

const crypto = require('crypto');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');
const redis = require('cl.jotacalderon.cf.framework/lib/redis');

const { google } = require('googleapis');

const apiBase = '/api/integration';

const pathConfig = '/archivosprivados/configuraciones/google-oauth2.json';
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

module.exports = {
  
  getConfig: async function (domain) {
    try {
      const cacheKey = crypto.createHash('md5').update('googleoauth2' + domain).digest('hex');

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
      return new google.auth.OAuth2(config.web.client_id, config.web.client_secret, config.web.redirect_uris[0]);
    } catch (error) {
      logger.error(config);
      logger.error(error);
      throw new Error(error);
    }
  },
  
  getURL: async function(domain) {
    try {
      
      const config = await this.getConfig(domain);
      if(config === null) {
        return null;
      }
      
      const auth = this.getConnection(config);
      
      return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: [
          'openid',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ],
      });
      
    } catch (error) {
      logger.error(error);
      logger.error(domain);
    }
    
    return '';
  },
  
  getUserInfo: async function (domain, code) {
    const config = await this.getConfig(domain);
    if(config === null) {
      return null;
    }
    const auth = this.getConnection(config);
    const { tokens } = await auth.getToken(code);
      
    auth.setCredentials(tokens);
      
    const ticket = await auth.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.web.client_id,
    });
      
    return ticket.getPayload();
  }
}