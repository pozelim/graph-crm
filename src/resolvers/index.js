import { Service } from 'typedi';
import UserResolvers from './user';
import CompanyResolvers from './company';

export default Service(
  [UserResolvers, CompanyResolvers],
  (userResolvers, companyResolvers) => {
    const { UserQuery, UserMutation } = userResolvers;
    const { CompanyQuery, CompanyMutation, Company } = companyResolvers;
    return {
      Query: {
        ...UserQuery,
        ...CompanyQuery,
      },
      Mutation: {
        ...UserMutation,
        ...CompanyMutation,
      },
      Company,
    };
  }
);
