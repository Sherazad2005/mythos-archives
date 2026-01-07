const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const ctrl = require("../controllers/auth.controller");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", requireAuth, ctrl.me);

module.exports = router;
