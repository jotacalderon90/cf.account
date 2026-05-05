'use strict';

const validMotor = ['mongo', 'oracle'];

if (validMotor.indexOf(process.env.DB_MOTOR) === -1) {
  console.log('Motor de BD inválido');
  process.exit(0);
}

module.exports = {
  role: require('./' + process.env.DB_MOTOR + '/role'),
  user: require('./' + process.env.DB_MOTOR + '/user'),
};
