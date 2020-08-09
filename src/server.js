/* src/server.js */

import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";
import resolvers from "./resolvers";
import { startDatabase } from "./database";
import expressPlayground from "graphql-playground-middleware-express";

// Create a context for holding contextual data (db info in this case)
const context = async () => {
  const db = await startDatabase();

  return { db };
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    context,
  })
);

//Graphql Playground route
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

export default app;