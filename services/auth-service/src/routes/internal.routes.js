const router = require("express").Router();
const requireInternalKey = require("../middlewares/requireInternalKey");
const ctrl = require("../controllers/internal.controller");

router.patch("/users/:id/reputation", requireInternalKey, ctrl.patchReputation);

module.exports = router;
