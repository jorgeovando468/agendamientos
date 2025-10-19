#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const { sequelize, User } = require('../models');

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
