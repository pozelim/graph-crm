/* src/database.js */

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';

const DATA_DIR = '.data';
let db;

async function startDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  const adapter = new FileSync(
    `${DATA_DIR}/${process.env.DB_FILE || 'db.json'}`
  );
  db = low(adapter);

  // Set some defaults (required if your JSON file is empty)
  db.defaults({ users: [] }).write();

  return db;
}

async function stopDatabase() {
  console.log('stopping database');
}

function getDataBase() {
  return db;
}

export { startDatabase, stopDatabase, getDataBase };
