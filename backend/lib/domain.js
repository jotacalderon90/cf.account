'use strict';

module.exports = function (host) {
  return host.split(':')[0].match(/([^.]+\.[^.]+)$/)[1];
};
