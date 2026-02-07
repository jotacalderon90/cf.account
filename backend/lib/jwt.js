'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const jwt = require('jsonwebtoken');

module.exports = {
    
  encode: function(id) {
    return jwt.sign({
      sub: id
    }, process.env.SESSION_SECRET, {
      expiresIn: '60m' 
      // 60 minutos - mucho más simple que calcular fechas
      // Alternativas: '1h', '2d', '7d', '30s', etc.
    });
  },
  
  decode: function(token) {
    try {
      const payload = jwt.verify(token, process.env.SESSION_SECRET);
      return payload;
    } catch(e) {
      if (e.name === 'TokenExpiredError') {
        return { error: 'expired' };
      }
      if (e.name === 'JsonWebTokenError') {
        return { error: 'invalid token' };
      }
      return { error: e.message };
    }
  },
  
  getToken(req) {
    if (!req.headers?.cookie) {
      return null;
    }

    const cookies = req.headers.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .reduce((acc, cookie) => {
        const [key, ...valueParts] = cookie.split('=');
        acc[key] = valueParts.join('='); // Por si el valor contiene '='
        return acc;
      }, {});

    const tokenValue = cookies.Authorization;

    if (!tokenValue || tokenValue === 'null') {
      return null;
    }

    try {
      return this.decode(tokenValue);
    } catch (error) {
      logger.error('Error decodificando token:', error);
      return null;
    }
  }
}