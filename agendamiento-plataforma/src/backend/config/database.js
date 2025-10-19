const { Sequelize } = require('sequelize');
const path = require('path');

const {
  DB_DIALECT = 'postgres',
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
  DB_NAME = 'agendamiento',
  DB_SSL = 'false',
} = process.env;

let sequelize;
if (String(DB_DIALECT).toLowerCase() === 'sqlite') {
  const storage = path.join(__dirname, '../../../database.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
} else {
  const sslEnabled = String(DB_SSL).toLowerCase() === 'true';
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false,
    dialectOptions: sslEnabled
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  });
}

module.exports = { sequelize };
