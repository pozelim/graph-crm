import { Service } from 'typedi';
import UserResolvers from './user';
import CompanyResolvers from './company';

export default Service(
  [UserResolvers, CompanyResolvers],
  (userResolvers, companyResolvers) => ({
    Query: {
      user: userResolvers.user,
      users: userResolvers.users,
      company: companyResolvers.company,
    },
    Mutation: {
      createUser: userResolvers.createUser,
      updateUser: userResolvers.updateUser,
      createCompany: companyResolvers.createCompany,
    },
  })
);
