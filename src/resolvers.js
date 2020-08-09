
/* src/resolvers.js */

const resolvers = {
  users: async (_, context) => {
    const { db } = await context();
    return db.get("users")
      .value()
  },
  user: async ({ id }, context) => {
    const { db } = await context();
    return db.get("users")
      .find({ id: id })
      .value();
  }

};

export default resolvers;