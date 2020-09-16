/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import supertest from 'supertest';
import mockedEnv from 'mocked-env';
import { Container } from 'typedi';
import makeApp from '../../src/server';
import DataBase from '../../src/database';

const DB_TEST_FILE = 'db-resolvers.json';
const dataBase = Container.get(DataBase);

test.skip('skip', () => {});

export async function setup() {
  mockedEnv({
    DB_FILE: DB_TEST_FILE,
  });
  const db = await dataBase.startDatabase();
  return supertest(makeApp({ db }));
}

export async function tearDown(callback) {
  const db = dataBase.getDataBase();
  callback(db);
}

export default { setup, tearDown };
