import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi';
import DataBase from '../database';

function isDuplicated(db, input) {
  const { name } = input;
  return !!db.get('companies').find({ name }).value();
}

export default Service([DataBase], (dataBase) => ({
  company: async ({ id }) => {
    const db = dataBase.getDataBase();
    return db.get('companies').find({ id }).value();
  },
  createCompany: async ({ input }) => {
    const { name } = input;
    const db = dataBase.getDataBase();
    if (isDuplicated(db, input)) {
      throw new Error('Name is already in use');
    } else {
      const company = { id: uuidv4(), name };
      await db.get('companies').push(company).write();
      return company;
    }
  },
}));
