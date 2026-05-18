'use strict';

module.exports = {
  //recibe un host (archivospublicos.jotace.cl, www.comercialastorga.cl, etc)
  //retorna el dominio padre, jotace.cl, comercialastorga.cl
  getParentDomain: function (host) {
    return host.split(':')[0].match(/([^.]+\.[^.]+)$/)[1];
  },

  //recibe request y retorna host de cuentas (account.jotace.cl, account.comercialastogra.cl)
  getHostAccount: function (req) {
    let hostAccount = '';
    if (process.env.NODE_ENV === 'production' && process.env.FRONT_MULTIDOMAIN === '1') {
      hostAccount = req.protocol + '://' + req.headers.host.replace(/^([^.:]+)/, 'account');
    } else {
      hostAccount = process.env.HOST_ACCOUNT;
    }
    return hostAccount;
  },
};
