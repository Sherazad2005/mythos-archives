const userRepo = require("../repositories/user.repo");

module.exports = {
  async listUsers(req, res, next) {
    try {
      const users = await userRepo.list();
      res.json(users);
    } catch (e) {
      next(e);
    }
  },
};
