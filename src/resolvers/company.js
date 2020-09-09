import { v4 as uuidv4 } from 'uuid';

function isDuplicated(db, input) {
  const { name } = input;
  return !!db.get('companies').find({ name }).value();
}

export default function makeUserResolvers({ db }) {
  return {
    company: async ({ id }) => db.get('companies').find({ id }).value(),
    createCompany: async ({ input }) => {
      const { name } = input;

      if (isDuplicated(db, input)) {
        throw new Error('Name is already in use');
      } else {
        const company = { id: uuidv4(), name };
        await db.get('companies').push(company).write();
        return company;
      }
    },
  };
}
