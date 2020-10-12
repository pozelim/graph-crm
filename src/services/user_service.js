import emailValidator from 'email-validator';
import DataBase from '../database';

export default class UserService {
  constructor(container) {
    this.prisma = container.get(DataBase).getDataBase();
  }

  getUsers() {
    return this.prisma.user.findMany();
  }

  getUserById(id) {
    return this.prisma.user.findOne({
      where: {
        id,
      },
    });
  }

  async createUser(input) {
    const { email, name, companyId } = input;

    if (!emailValidator.validate(email)) {
      throw new Error('Invalid email');
    } else {
      return this.prisma.user.create({
        data: {
          name,
          email,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
      });
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
