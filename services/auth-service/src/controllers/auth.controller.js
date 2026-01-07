const authService = require("../services/auth.service");
const userRepo = require("../repositories/user.repo");

module.exports = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (e) {
      // email/username déjà pris
      if (e.code === "P2002") return res.status(409).json({ error: "Email or username already exists" });
      return next(e);
    }
  },

  async login(req, res, next) {
    try {
      return res.json(await authService.login(req.body));
    } catch (e) {
      return next(e);
    }
  },

  async me(req, res, next) {
    try {
      const user = await userRepo.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        reputation: user.reputation,
      });
    } catch (e) {
      return next(e);
    }
  },
};
