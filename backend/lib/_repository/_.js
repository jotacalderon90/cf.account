'use strict';

let role, user;

switch (process.env.DB_MOTOR) {
  case 'mongo':
    role = require('./mongo/role');
    user = require('./mongo/user');
    break;
  case 'oracle':
    role = require('./oracle/role');
    user = require('./oracle/user');
    break;
}

module.exports = {
  role,
  user,
};
