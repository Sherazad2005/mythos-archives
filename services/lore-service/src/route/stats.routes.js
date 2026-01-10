const router = require("express").Router();
const ctrl = require("../controllers/stats.controller");

router.get("/occurrences", ctrl.occurrencesByCreature);

router.get("/average", ctrl.averageTestimoniesPerCreature);

router.get("/top", ctrl.topCreaturesByTestimonies);

router.get("/status", ctrl.testimonyStatusDistribution);

module.exports = router;
