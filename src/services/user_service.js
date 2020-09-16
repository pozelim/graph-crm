import { v4 as uuidv4 } from 'uuid';
import emailValidator from 'email-validator';

export default class UserService {
  constructor(db) {
    this.db = db;
  }

  isDuplicated(user) {
    const { email } = user;
    return !!this.db.get('users').find({ email }).value();
  }

  getUsers() {
    return this.db.get('users').value();
  }

  getUserById(id) {
    return this.db.get('users').find({ id }).value();
  }

  async createUser(input) {
    const { email, name } = input;
    if (this.isDuplicated(input)) {
      throw new Error('Email is already in use');
    } else if (!emailValidator.validate(email)) {
      throw new Error('Invalid email');
    } else {
      const user = { id: uuidv4(), name, email };
      await this.db.get('users').push(user).write();
      return user;
    }
  }

  async updateUser(input) {
    const { id, email, name } = input;
    const userRecord = this.db.get('users').find({ id });
    if (!userRecord) {
      throw new Error('Not found');
    } else {
      if (this.isDuplicated(input)) {
        throw new Error('Email is already in use');
      } else if (email && !emailValidator.validate(email)) {
        throw new Error('Invalid email');
      }
      const userUpdated = { ...userRecord.value(), email, name };
      await userRecord.assign(userUpdated).write();
      return userUpdated;
    }
  }
}
