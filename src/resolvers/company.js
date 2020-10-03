import { Service } from 'typedi';
import CompanyService from '../services/company_service';

export default Service([CompanyService], (cs) => ({
  company: async (parent, { id }) => cs.getCompany(id),
  createCompany: async (parent, { input }) => cs.createCompany(input),
}));
