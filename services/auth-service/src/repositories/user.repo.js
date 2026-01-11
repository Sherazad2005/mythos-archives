const prisma = require("../utils/prisma");

async function create(data) {
  return prisma.user.create({ data });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function list() {
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
}

async function updateRole(id, role) {
  return prisma.user.update({ where: { id }, data: { role } });
}


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
  create,
  findByEmail,
  findById,
  list,
  updateRole,
  addReputationAndCheckRole,
};




