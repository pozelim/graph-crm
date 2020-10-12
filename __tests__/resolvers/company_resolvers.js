/* eslint-disable no-undef */
import { setup, tearDown } from './base';

let request;
let prisma;
let data = {};

async function buildData() {
  const company1 = await prisma.company.create({
    data: { name: 'company1' },
  });

  return {
    company1,
  };
}

afterAll(async () => tearDown(async () => prisma.company.deleteMany({})));

beforeAll(async () => {
  const setupResult = await setup();
  request = setupResult.request;
  prisma = setupResult.prisma;

  await prisma.company.deleteMany({});
  data = await buildData();
});

function create(input) {
  const { name } = input;
  return request
    .post('/graphql')
    .set('Accept', 'application/json')
    .send({
      query: `
      mutation { createCompany(input: {
          name: "${name}"
        }) {
          name
        }
      }`,
    });
}

function getById(id) {
  return request
    .post('/graphql')
    .set('Accept', 'application/json')
    .send({
      query: `
        { company(id: "${id}") {
            name
          }
        }`,
    });
}

it('create company', async () => {
  const response = await create({ name: 'dummy' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchSnapshot();
});

it('get company by id', async () => {
  const response = await getById(data.company1.id);
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchSnapshot();
});
