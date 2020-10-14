import DataBase from '../database';

export default class CompanyService {
  constructor(container) {
    this.prisma = container.get(DataBase).getDataBase();
  }

  getCompany(id) {
    return this.prisma.company.findOne({
      where: {
        id,
      },
    });
  }

  async createCompany(companyInput) {
    const { name } = companyInput;
    return this.prisma.company.create({
      data: {
        name,
      },
    });
  }

  getUsers(id, { skip, take }) {
    const where = { companyId: id };
    const count = this.prisma.user.count({
      where,
    });

    const users = this.prisma.user.findMany({
      where,
      skip,
      take,
    });

    return {
      count,
      users,
    };
  }
}
