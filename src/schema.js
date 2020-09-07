/* src/schema.js */

import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type User {
        id: ID!
        name: String!
        email: String
    }

    type Company {
        id: ID!
        name: String!
    }

    type Query {
        users: [User!]!,
        user(id: String!): User
        company(id: String!): Company
    }

    input UserInput {
        name: String!
        email: String!
    }

    input CompanyInput {
        name: String!
    }

    type Mutation {
        createUser(input: UserInput): User
        createCompany(input: CompanyInput): Company
    }

`);

export default schema;
