const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/admin.controller");

router.get("/users", requireAuth, requireRole("ADMIN"), ctrl.listUsers);

module.exports = router;
