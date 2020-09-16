/* src/server.js */

import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import schema from './schema';
import makeResolvers from './resolvers';
import UserServer from './services/user_service';
import { login, verifyJwt } from './login';

dotenv.config();

function resolveDependencies(props) {
  const { db } = props;
  const userService = new UserServer(db);
  return { db, userService };
}

export default function makeApp(props) {
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
      rootValue: makeResolvers(resolveDependencies(props)),
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
