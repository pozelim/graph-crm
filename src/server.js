/* src/server.js */

import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import schema from './schema';
import resolvers from './resolvers';
import { startDatabase } from './database';
import { login, verifyJwt } from './login';

dotenv.config();

// Create a context for holding contextual data (db info in this case)
const context = async () => {
  const db = await startDatabase();

  return { db };
};

const app = express();

app.use(
  jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({
    path: ['/login/token', '/playground', '/graphql'],
  }),
  verifyJwt
);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    context,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login/token', login);
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.get('/protected', (req, res) => {
  res.json({ ok: 'ok' });
});
export default app;
