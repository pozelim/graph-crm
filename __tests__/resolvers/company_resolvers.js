/* eslint-disable no-undef */
import supertest from 'supertest';
import mockedEnv from 'mocked-env';
import { Container } from 'typedi';
import makeApp from '../../src/server';
import DataBase from '../../src/database';

const DB_TEST_FILE = 'db-test_company_resolvers.json';
let request;
const dataBase = Container.get(DataBase);

mockedEnv({
  DB_FILE: DB_TEST_FILE,
});

async function tearDown() {
  const db = dataBase.getDataBase();
  if (db) {
    await db.set('companies', []).write();
  }
}

beforeAll(async () => {
  const db = await dataBase.startDatabase();
  request = supertest(makeApp({ db }));
});

beforeEach(tearDown);

function mockInputWithVariant(variant = 'a') {
  return { name: `Dummy company ${variant}` };
}

function create(input) {
  const { name } = input;
  return request
    .post('/graphql')
    .send({
      query: `mutation { createCompany(input: {
          name: "${name}"
        }) { id, name }}`,
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);
}

function createWithVariant(variant) {
  return create(mockInputWithVariant(variant));
}

it('fetch company', async (done) => {
  createWithVariant().end((createdErr, createdRes) => {
    const { id } = createdRes.body.data.createCompany;
    request
      .post('/graphql')
      .send({
        query: `{ company(id:"${id}") { id, name } }`,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.data.company.id).not.toBeNull();
          done();
        }
      });
  });
});

it('create company', async (done) => {
  createWithVariant().end((err, res) => {
    if (err) {
      done(err);
    } else {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.createCompany.id).not.toBeNull();
      done();
    }
  });
});

it('create company with duplicated name should fail', async (done) => {
  createWithVariant('a').end(() => {});
  createWithVariant('a').end((err, res) => {
    if (err) {
      done(err);
    } else {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.createCompany).toBeNull();
      done();
    }
  });
});
