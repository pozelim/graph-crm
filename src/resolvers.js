/* src/resolvers.js */

import { v4 as uuidv4 } from 'uuid';

const resolvers = {
  users: async (_, context) => {
    const { db } = await context();
    return db.get('users').value();
  },
  user: async ({ id }, context) => {
    const { db } = await context();
    return db.get('users').find({ id }).value();
  },
  createUser: async ({ input }, context) => {
    const { db } = await context();
    const user = { id: uuidv4(), name: input.name, email: input.email };
    db.get('users').push(user).write();
    return user;
  },
};

export default resolvers;
