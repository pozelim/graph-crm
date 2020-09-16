/* src/server.js */

import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import { Container } from 'typedi';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import schema from './schema';
import Resolvers from './resolvers';
import { login, verifyJwt } from './login';

dotenv.config();

export default function makeApp() {
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
      rootValue: Container.get(Resolvers),
    })
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/login/token', login);
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.get('/protected', (req, res) => {
    res.json({ ok: 'ok' });
  });

  return app;
}
