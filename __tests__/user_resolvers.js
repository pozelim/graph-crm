/* eslint-disable no-undef */
import supertest from 'supertest';
import mockedEnv from 'mocked-env';
import makeApp from '../src/server';
import { startDatabase, getDataBase } from '../src/database';

const DB_TEST_FILE = 'db-test_user_resolvers.json';
let request;

mockedEnv({
  DB_FILE: DB_TEST_FILE,
});

async function tearDown() {
  const db = getDataBase();
  if (db) {
    await db.set('users', []).write();
  }
}

beforeAll(async () => {
  const db = await startDatabase();
  request = supertest(makeApp({ db }));
});

beforeEach(tearDown);

function mockUserWithVariant(variant = 'a') {
  return { name: `Dummy ${variant}`, email: `dummy_${variant}@dummy.com` };
}

function createUser(user) {
  return request
    .post('/graphql')
    .send({
      query: `mutation { createUser(input: {
        name: "${user.name}",
        email: "${user.email}",
      }) { id }}`,
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);
}

function createUserWithVariant(variant) {
  return createUser(mockUserWithVariant(variant));
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
  createUserWithVariant().end((createdErr, createdRes) => {
    const { id } = createdRes.body.data.createUser;
    request
      .post('/graphql')
      .send({
        query: `{ user(id:"${id}") { id, name } }`,
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

it('update user', async (done) => {
  createUserWithVariant().end((createdErr, createdRes) => {
    const { id } = createdRes.body.data.createUser;
    const user = mockUserWithVariant('b');
    request
      .post('/graphql')
      .send({
        query: `mutation { updateUser(input: {
          id: "${id}",
          name: "${user.name}",
          email: "${user.email}",
        }) { id, name, email }}`,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.data.updateUser).not.toBeNull();
          expect(res.body.data.updateUser.name).toEqual(user.name);
          expect(res.body.data.updateUser.email).toEqual(user.email);
          done();
        }
      });
  });
});
