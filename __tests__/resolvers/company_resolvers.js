/* eslint-disable no-undef */
import { setup, tearDown } from './base';

let request;

beforeEach(async () => tearDown(async (db) => db.set('companies', []).write()));

beforeAll(async () => {
  request = (await setup()).request;
});

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
