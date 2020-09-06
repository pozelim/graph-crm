/* src/schema.js */

import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Query {
        users: [User!]!,
        user(id: String!): User
    }

    input UserInput {
        name: String
        email: String
    }

    type Mutation {
        createUser(input: UserInput): User
    }

    type User {
        id: ID! 
        name: String!
        email: String
    }
`);

export default schema;
