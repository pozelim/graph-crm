/* eslint-disable no-undef */
import supertest from 'supertest';
import fs from 'fs';
import mockedEnv from 'mocked-env';
import app from '../src/server';
import { stopDatabase, getDataBase } from '../src/database';

const DB_TEST_FILE = 'db-test.json';

mockedEnv({
  DB_FILE: DB_TEST_FILE,
  JWT_SECRET: 'secret',
});

const request = supertest(app);

afterAll(async () => {
  await stopDatabase();
  fs.unlinkSync(`.data/${DB_TEST_FILE}`);
});

beforeEach(() => {
  const db = getDataBase();
  if (db) {
    db.set('users', []).write();
  }
});

function mockUserWithVariant(variant = 'a') {
  return { name: `Dummy ${variant}`, email: `dummy_${variant}@dummy.com` };
}

function createUserWithVariant(variant) {
  return createUser(mockUserWithVariant(variant));
}

function createUser(user) {
  return request
    .post('/graphql')
    .send({
      query: `mutation { createUser(input: {
        name: "${user.name}"
        email: "${user.email}"
      }) { id }}`,
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);
}

it('fetch users', async (done) => {
  createUserWithVariant('a').end(() => {});
  createUserWithVariant('b').end(() => {});
  request
    .post('/graphql')
    .send({
      query: '{ users { id, name } }',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.users.length).toEqual(2);
        done();
      }
    });
});

it('fetch user', async (done) => {
  let userId;
  createUserWithVariant().end((createdErr, createdRes) => {
    userId = createdRes.body.data.createUser.id;
    request
      .post('/graphql')
      .send({
        query: `{ user(id:"${userId}") { id, name } }`,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.data.user.name).not.toBeNull();
          done();
        }
      });
  });
});

it('create user', async (done) => {
  createUserWithVariant().end((err, res) => {
    if (err) {
      done(err);
    } else {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.createUser.id).not.toBeNull();
      done();
    }
  });
});

it('create user with duplicated email should fail', async (done) => {
  createUserWithVariant('a').end(() => {});
  createUserWithVariant('a').end((err, res) => {
    if (err) {
      done(err);
    } else {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.createUser).toBeNull();
      done();
    }
  });
});

it('create user with invalid email should fail', async (done) => {
  const user = createUserWithVariant('invalid_mail');
  user.email = 'invalid mail';
  createUser(user).end((err, res) => {
    if (err) {
      done(err);
    } else {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.createUser).toBeNull();
      done();
    }
  });
});
