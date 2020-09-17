import { Service } from 'typedi';
import CompanyService from '../services/company_service';

export default Service([CompanyService], (companyService) => ({
  company: async ({ id }) => companyService.getCompany(id),
  createCompany: async ({ input }) => companyService.createCompany(input),
}));
