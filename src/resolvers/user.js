import { Service } from 'typedi';
import UserService from '../services/user_service';

export default Service([UserService], (userService) => ({
  users: () => userService.getUsers(),
  user: ({ id }) => userService.getUserById(id),
  createUser: async ({ input }) => {
    const user = await userService.createUser(input);
    return user;
  },
  updateUser: async ({ input }) => userService.updateUser(input),
}));
