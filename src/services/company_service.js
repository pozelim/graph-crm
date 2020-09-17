import { v4 as uuidv4 } from 'uuid';
import DataBase from '../database';

export default class CompanyService {
  constructor(container) {
    this.db = container.get(DataBase).getDataBase();
  }

  isDuplicated(company) {
    const { name } = company;
    return !!this.db.get('companies').find({ name }).value();
  }

  getCompany(id) {
    return this.db.get('companies').find({ id }).value();
  }

  async createCompany(companyInput) {
    const { name } = companyInput;
    if (this.isDuplicated(companyInput)) {
      throw new Error('Name is already in use');
    } else {
      const company = { id: uuidv4(), name };
      this.db.get('companies').push(company).write();
      return company;
    }
  }
}
