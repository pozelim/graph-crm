/* src/index.js */

import dotenv from 'dotenv';
import makeApp from './server';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });

const port = process.env.PORT || '4000';

makeApp().listen(port);
console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
