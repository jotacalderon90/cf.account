'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const tracking = function (req, email, host) {
  logger.info('generando tracking');
  ((req.session.host = host), (req.session.email = email));
  req.session.loginTime = new Date().toISOString();
  req.session.userAgent = req.headers['user-agent'];
  req.session.ip = req.ip + '||' + req.headers['x-forwarded-for'];
};

const getCookie = function (domain) {
  return {
    path: '/',
    httpOnly: true, // SIEMPRE
    maxAge: 1000 * 60 * 60, // SIEMPRE 1 hora
    secure: process.env.COOKIE_SECURE === '1', // POR PARAMETRO
    sameSite: process.env.COOKIE_SAMESITE || 'Strict', // SIEMPRE
    ...(process.env.COOKIE_DOMAIN == 1 && { domain: domain }),
  };
};

const getHost = function (host) {
  return '.' + host.split(':')[0].match(/([^.]+\.[^.]+)$/)[1];
};

module.exports = {
  create: function (req, res, cookie, email, host) {
    logger.info('creando sesion');

    res.cookie('Authorization', cookie, getCookie(getHost(req.headers.host)));

    if (cookie && email) {
      tracking(req, email, host);
    }
  },

  destroy: function (req, res) {
    logger.info('destruyendo sesion');

    req.session.destroy((err) => {
      if (err) {
        logger.error('Error al destruir session:');
        logger.error(err);
      }
    });

    res.clearCookie('Authorization', getCookie(getHost(req.headers.host)));
  },
};
