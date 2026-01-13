'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const tracking = function(req,email) {
  logger.info('generando tracking');
  req.session.email = email;
  req.session.loginTime = new Date().toISOString();
  req.session.userAgent = req.headers['user-agent'];
  req.session.ip = req.ip;
}

module.exports = {
  
  create: function(req, res, cookie, email){
    logger.info('creando sesion');
    if(process.env.COOKIE_DOMAIN){
      res.cookie('Authorization', cookie, { 
        domain: process.env.COOKIE_DOMAIN, 
        path: '/', 
        secure: true,
        httpOnly: true,                                   // inaccesible vía JavaScript/XSS
        maxAge: 1000 * 60 * 60,                           // 1 hora
        sameSite: process.env.COOKIE_SAMESITE || 'Strict' // protege contra CSRF
      });
    }else{
      res.cookie('Authorization', cookie);
    }
    
    if(cookie && email) {
      tracking(req, email);
    }
  },
  
  destroy: function(req, res) {
    logger.info('destruyendo sesion');
    req.session.destroy((err) => {
      if (err) {
        logger.error('Error al destruir session:');
        logger.error(err);
      }
    });
    this.create(req, res);
  }
  
}