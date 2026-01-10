const prisma = require("../utils/prisma");

async function addReputationAndCheckRole(id, delta) {
  const user = await prisma.user.update({
    where: { id },
    data: { reputation: { increment: delta } },
  });

  if (user.reputation >= 10 && user.role === "USER") {
    return prisma.user.update({
      where: { id },
      data: { role: "EXPERT" },
    });
  }

  return user;
}

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
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        reputation: true,
        createdAt: true,
      },
    });
  },

  updateRole(id, role) {
    return prisma.user.update({ where: { id }, data: { role } });
  },

  // ✅ la fonction importante pour le 13/20
  addReputationAndCheckRole,
};




