const userRepo = require("../repositories/user.repo");

module.exports = {
  async patchReputation(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { delta } = req.body; // ex: +3, -1, +1

      if (typeof delta !== "number") {
        return res.status(400).json({ error: "delta must be a number" });
      }

      const user = await userRepo.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });

     
      const newReputation = (user.reputation || 0) + delta;

      let newRole = user.role;
      if (newReputation >= 10 && user.role === "USER") {
        newRole = "EXPERT";
      }

      
      const updated = await userRepo.updateReputationAndRole(id, newReputation, newRole);

      res.json({
        id: updated.id,
        reputation: updated.reputation,
        role: updated.role,
      });
    } catch (e) {
      next(e);
    }
  },
};
