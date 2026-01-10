const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/testimony.controllers");


const verifyTokenViaAuth = require("../middlewares/verifyTokenViaAuth");
const requireRole = require("../middlewares/requireRole");


router.post("/", verifyTokenViaAuth, ctrl.creatTestimony);


router.get("/", ctrl.getAllTestimonyFilter);


router.put("/:id/validate", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"), ctrl.validateTestimony);
router.put("/:id/reject", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"), ctrl.rejectTestimony);

module.exports = router;
