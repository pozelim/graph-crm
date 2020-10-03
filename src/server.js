/* src/server.js */

import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
import { ApolloServer, gql } from 'apollo-server-express';
import { Container } from 'typedi';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import { readFileSync } from 'fs';
import { resolve } from 'path';
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

  const typeDefs = gql(
    readFileSync(resolve(__dirname, 'schema.graphql'), { encoding: 'utf8' })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers: Container.get(Resolvers),
  });

  server.applyMiddleware({ app, path: '/graphql' });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/login/token', login);
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.get('/protected', (req, res) => {
    res.json({ ok: 'ok' });
  });

  return app;
}
