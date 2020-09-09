import { v4 as uuidv4 } from 'uuid';
import emailValidator from 'email-validator';

function isDuplicated(db, input) {
  const { email } = input;
  return !!db.get('users').find({ email }).value();
}

export default function makeUserResolvers({ db }) {
  return {
    users: async () => db.get('users').value(),
    user: async ({ id }) => db.get('users').find({ id }).value(),
    createUser: async ({ input }) => {
      const { email, name } = input;
      if (isDuplicated(db, input)) {
        throw new Error('Email is already in use');
      } else if (!emailValidator.validate(email)) {
        throw new Error('Invalid email');
      } else {
        const user = { id: uuidv4(), name, email };
        await db.get('users').push(user).write();
        return user;
      }
    },
    updateUser: async ({ input }) => {
      const { id, email, name } = input;
      const userRecord = db.get('users').find({ id });
      if (!userRecord) {
        throw new Error('Not found');
      } else {
        if (isDuplicated(db, input)) {
          throw new Error('Email is already in use');
        } else if (email && !emailValidator.validate(email)) {
          throw new Error('Invalid email');
        }
        const userUpdated = { ...userRecord.value(), email, name };
        await userRecord.assign(userUpdated).write();
        return userUpdated;
      }
    },
  };
}
