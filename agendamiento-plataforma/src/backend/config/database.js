const { Sequelize } = require('sequelize');
const path = require('path');

const {
  DB_DIALECT = 'mysql',
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'agendamiento',
  DB_SSL = 'false',
} = process.env;

let sequelize;
const dialect = String(DB_DIALECT).toLowerCase();
if (dialect === 'sqlite') {
  const storage = path.join(__dirname, '../../../database.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
} else {
  const sslEnabled = String(DB_SSL).toLowerCase() === 'true';
  const baseConfig = {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect,
    logging: false,
  };
  if (dialect === 'postgres' && sslEnabled) {
    baseConfig.dialectOptions = { ssl: { require: true, rejectUnauthorized: false } };
  }
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, baseConfig);
}

module.exports = { sequelize };
