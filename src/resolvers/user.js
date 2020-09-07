import { v4 as uuidv4 } from 'uuid';
import emailValidator from 'email-validator';

function isDuplicated(db, input) {
  const { email } = input;
  return !!db.get('users').find({ email }).value();
}

const userResolvers = {
  users: async (_, context) => {
    const { db } = await context();
    return db.get('users').value();
  },
  user: async ({ id }, context) => {
    const { db } = await context();
    return db.get('users').find({ id }).value();
  },
  createUser: async ({ input }, context) => {
    const { email, name } = input;
    const { db } = await context();
    if (isDuplicated(db, input)) {
      throw new Error('Email is already in use');
    } else if (!emailValidator.validate(email)) {
      throw new Error('Invalid email');
    } else {
      const user = { id: uuidv4(), name, email };
      db.get('users').push(user).write();
      return user;
    }
  },
  updateUser: async ({ input }, context) => {
    const { id, email, name } = input;
    const { db } = await context();
    const userRecord = db.get('users').find({ id });
    if (!userRecord) {
      throw new Error('Not found');
    } else {
      if (email && !emailValidator.validate(email)) {
        throw new Error('Invalid email');
      }
      const userUpdated = { ...userRecord.value(), email, name };
      userRecord.assign(userUpdated).write();
      return userUpdated;
    }
  },
};

export default userResolvers;
