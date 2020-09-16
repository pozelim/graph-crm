/* src/index.js */

import { Container } from 'typedi';
import makeApp from './server';
import DataBase from './database';

const port = process.env.PORT || '4000';

Container.get(DataBase)
  .startDatabase()
  .then((db) => {
    makeApp({ db }).listen(port);
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
