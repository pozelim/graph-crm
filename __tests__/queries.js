/* eslint-disable no-undef */
import supertest from 'supertest';
import fs from 'fs';
import app from '../src/server';
import { stopDatabase } from '../src/database';

const request = supertest(app);

afterAll(async () => {
  await stopDatabase();
  fs.unlinkSync('.data/db.json');
});

function createUser() {
  return request
    .post('/graphql')
    .send({
      query:
        'mutation { createUser(input: {name: "andy", email: "andy@gcrm.com"}) { id }}',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);
}

test('fetch users', async (done) => {
  createUser().end(() => {});
  createUser().end(() => {});
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

test('fetch user', async (done) => {
  let userId;
  createUser().end((createErr, createRes) => {
    userId = createRes.body.data.createUser.id;
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

test('create user', async (done) => {
  createUser().end((err, res) => {
    if (err) {
      done(err);
    } else {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.createUser.id).not.toBeNull();
      done();
    }
  });
});
