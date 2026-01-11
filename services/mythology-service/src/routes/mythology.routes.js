const router = require("express").Router();
const ctrl = require("../controllers/mythology.controller");

router.get("/stats", ctrl.getStats);

module.exports = router;
