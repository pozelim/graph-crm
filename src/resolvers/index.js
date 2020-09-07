import userResolvers from './user';
import companyResolvers from './company';

export default {
  ...userResolvers,
  ...companyResolvers,
};
