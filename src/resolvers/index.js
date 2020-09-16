import { Service } from 'typedi';
import UserResolvers from './user';
import CompanyResolvers from './company';

export default Service(
  [UserResolvers, CompanyResolvers],
  (userResolvers, companyResolvers) => ({
    ...userResolvers,
    ...companyResolvers,
  })
);
