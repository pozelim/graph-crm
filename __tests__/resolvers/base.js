/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import supertest from 'supertest';
import { Container } from 'typedi';
import dotenv from 'dotenv';
import makeApp from '../../src/server';
import DataBase from '../../src/database';

dotenv.config({ path: '.env.test' });

const dataBase = Container.get(DataBase);
const request = supertest(makeApp());

test.skip('skip', () => {});

export async function setup() {
  return { request, prisma: dataBase.getDataBase() };
}

export async function tearDown(callback) {
  callback(dataBase.getDataBase());
}

export default { setup, tearDown };
