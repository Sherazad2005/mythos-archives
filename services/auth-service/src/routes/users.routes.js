const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/users.controller");

router.patch("/:id/role", requireAuth, requireRole("ADMIN"), ctrl.patchRole);

module.exports = router;
