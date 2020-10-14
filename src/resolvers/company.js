import { Service } from 'typedi';
import CompanyService from '../services/company_service';

export default Service([CompanyService], (cs) => ({
  CompanyQuery: {
    company: async (parent, { id }) => cs.getCompany(id),
  },
  CompanyMutation: {
    createCompany: async (parent, { input }) => cs.createCompany(input),
  },
  Company: {
    users: async (parent, args) => cs.getUsers(parent.id, args),
  },
}));
