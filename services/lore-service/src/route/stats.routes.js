const router = require("express").Router();
const ctrl = require("../controllers/stats.controller");
const requireRole = require("../middlewares/requireRole");
const verifyTokenViaAuth = require("../middlewares/verifyTokenViaAuth");

router.get("/occurrences", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"), ctrl.occurrencesByCreature);

router.get("/average", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"),ctrl.averageTestimoniesPerCreature);

router.get("/top", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"), ctrl.topCreaturesByTestimonies);

router.get("/status", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"), ctrl.testimonyStatusDistribution);

router.get("/summary", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"), ctrl.globalSummary);

router.get("/keywords", verifyTokenViaAuth, requireRole("EXPERT", "ADMIN"), ctrl.topKeywords);
module.exports = router;
