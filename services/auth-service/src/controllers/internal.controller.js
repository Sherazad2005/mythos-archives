const userRepo = require("../repositories/user.repo");

async function patchReputation(req, res, next) {
  try {
    const id = Number(req.params.id);
    const delta = Number(req.body?.delta);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    if (Number.isNaN(delta)) {
      return res.status(400).json({ error: "delta is required (number)" });
    }

    const user = await userRepo.addReputationAndCheckRole(id, delta);

    return res.json({
      id: user.id,
      role: user.role,
      reputation: user.reputation,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { patchReputation };

