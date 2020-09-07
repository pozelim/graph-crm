import { v4 as uuidv4 } from 'uuid';

function isDuplicated(db, input) {
  const { name } = input;
  return !!db.get('companies').find({ name }).value();
}

const userResolvers = {
  company: async ({ id }, context) => {
    const { db } = await context();
    return db.get('companies').find({ id }).value();
  },
  createCompany: async ({ input }, context) => {
    const { name } = input;
    const { db } = await context();

    if (isDuplicated(db, input)) {
      throw new Error('Name is already in use');
    } else {
      const company = { id: uuidv4(), name };
      db.get('companies').push(company).write();
      return company;
    }
  },
};

export default userResolvers;
