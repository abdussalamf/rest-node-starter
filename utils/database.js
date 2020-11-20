const Sequelize = require('sequelize');
require('dotenv').config();
const env = require('./env');

const sequelize = new Sequelize(env.parseEnv('DB_DATABASE'), env.parseEnv('DB_USER'), env.parseEnv('DB_PASS'), {
  dialect: 'postgres',
  host: env.parseEnv('DB_HOST', 'localhost'),
  port: env.parseEnvNumber('DB_PORT'),
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;
