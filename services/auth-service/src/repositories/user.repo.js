const prisma = require("../utils/prisma");

module.exports = {
  create(data) {
    return prisma.user.create({ data });
  },
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
  list() {
    return prisma.user.findMany({
      select: { id: true, email: true, username: true, role: true, reputation: true, createdAt: true },
    });
  },
  updateRole(id, role) {
    return prisma.user.update({ where: { id }, data: { role } });
  },
};

