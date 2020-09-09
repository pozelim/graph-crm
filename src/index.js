/* src/index.js */

import makeApp from './server';
import { startDatabase } from './database';

const port = process.env.PORT || '4000';

startDatabase().then((db) => {
  makeApp({ db }).listen(port);
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});
