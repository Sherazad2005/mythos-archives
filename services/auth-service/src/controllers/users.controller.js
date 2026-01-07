const userRepo = require("../repositories/user.repo");

module.exports = {
  async patchRole(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { role } = req.body;

      const allowed = ["USER", "EXPERT", "ADMIN"];
      if (!allowed.includes(role)) return res.status(400).json({ error: "Invalid role" });

      const updated = await userRepo.updateRole(id, role);
      res.json({ id: updated.id, role: updated.role });
    } catch (e) {
      next(e);
    }
  },
};
