#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const { sequelize, User } = require('../models');
const mysql = require('mysql2/promise');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ensureConnectionWithRetry(maxRetries = 20) {
  let lastErr;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await sequelize.authenticate();
      return;
    } catch (err) {
      lastErr = err;
      console.log(`DB not ready yet, retry ${i + 1}/${maxRetries}...`);
      await sleep(1500);
    }
  }
  throw lastErr;
}

async function main() {
  // When using MySQL, ensure database exists first
  if (String(process.env.DB_DIALECT).toLowerCase() === 'mysql') {
    const { DB_HOST='127.0.0.1', DB_PORT='3306', DB_USER='root', DB_PASSWORD='', DB_NAME='agendamiento' } = process.env;
    const conn = await mysql.createConnection({ host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.end();
  }

  await ensureConnectionWithRetry();
  await sequelize.sync();

  const apiKey = process.env.API_KEY || 'dev-key';
  await User.findOrCreate({
    where: { email: 'admin@example.com' },
    defaults: { name: 'Admin', apiKey },
  });

  console.log('Database synchronized and default admin ensured.');
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
