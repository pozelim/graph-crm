export default function makeUserResolvers({ userService }) {
  return {
    users: () => userService.getUsers(),
    user: ({ id }) => userService.getUserById(id),
    createUser: async ({ input }) => {
      const user = await userService.createUser(input);
      return user;
    },
    updateUser: async ({ input }) => userService.updateUser(input),
  };
}
