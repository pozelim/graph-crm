import makeUserResolvers from './user';
import makeCompanyResolvers from './company';

export default function makeResolvers(props) {
  return {
    ...makeUserResolvers(props),
    ...makeCompanyResolvers(props),
  };
}
