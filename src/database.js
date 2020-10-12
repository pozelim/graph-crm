/* src/database.js */

import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';

const prisma = new PrismaClient();

function getDataBase() {
  return prisma;
}

export default Service([], () => ({ getDataBase }));
