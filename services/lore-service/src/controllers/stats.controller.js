const Testimony = require("../models/testimony.model");
const Creature = require("../models/creature.model");

async function occurrencesByCreature(req, res) {
  const rows = await Testimony.aggregate([
    { $group: { _id: "$creatureId", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json(rows);
}

async function averageTestimoniesPerCreature(req, res) {
  const totalCreatures = await Creature.countDocuments();
  const totalTestimonies = await Testimony.countDocuments();

  const avg = totalCreatures === 0 ? 0 : totalTestimonies / totalCreatures;

  res.json({
    totalCreatures,
    totalTestimonies,
    average: avg
  });
}

async function topCreaturesByTestimonies(req, res) {
  const limit = Number(req.query.limit || 5);

  const rows = await Testimony.aggregate([
    { $group: { _id: "$creatureId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);

  res.json(rows);
}

async function testimonyStatusDistribution(req, res) {
  const rows = await Testimony.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const result = { PENDING: 0, VALIDATED: 0, REJECTED: 0 };
  for (const r of rows) result[r._id] = r.count;

  res.json(result);
}

module.exports = {
  occurrencesByCreature,
  averageTestimoniesPerCreature,
  topCreaturesByTestimonies,
  testimonyStatusDistribution,
};
