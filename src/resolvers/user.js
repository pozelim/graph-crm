import { Service } from 'typedi';
import UserService from '../services/user_service';

export default Service([UserService], (userService) => ({
  users: () => userService.getUsers(),
  user: (parent, { id }) => userService.getUserById(id),
  createUser: async (parent, { input }) => {
    const user = await userService.createUser(input);
    return user;
  },
  updateUser: async (parent, { input }) => userService.updateUser(input),
}));
