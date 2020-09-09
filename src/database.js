/* src/database.js */

import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import fs from 'fs';

const DATA_DIR = '.data';
let db;

async function startDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  const adapter = new FileAsync(
    `${DATA_DIR}/${process.env.DB_FILE || 'db.json'}`
  );
  db = await low(adapter);

  // Set some defaults (required if your JSON file is empty)
  await db.defaults({ users: [], companies: [] }).write();

  return db;
}

function getDataBase() {
  return db;
}

export { startDatabase, getDataBase };
