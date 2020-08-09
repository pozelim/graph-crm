/* src/database.js */

import { Users } from "./data";
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import fs from "fs"

const DATA_DIR = ".data"

async function startDatabase() {
  if (!fs.existsSync(DATA_DIR)){
    fs.mkdirSync(DATA_DIR);
  }

  const adapter = new FileSync(`${DATA_DIR}/db.json`);
  const db = low(adapter);

  // Set some defaults (required if your JSON file is empty)
  db.defaults({ users: [] })
    .write();

  // Add users
  db.set("users", Users)
    .write();

  return db;
}

async function stopDatabase() {
}

export {
  startDatabase,
  stopDatabase,
};