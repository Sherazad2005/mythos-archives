const Creature = require('../models/creature.model');
const Testimony = require("../models/testimony.model");


async function createCreature(req, res) {
    try {
        const data = pickCreatureData(req.body);
        const creature = await 
    Creature.create(data);
    return res.status(201).json(creature);
    } catch(error) {
        return handleCreatureError(res, error);
    }
}

async function getAllCreature(req, res) {
  try {
    const creatures = await Creature.find();

    const creaturesWithScore = await Promise.all(
      creatures.map(async (c) => {
        const validatedCount = await Testimony.countDocuments({
          creatureId: c._id,
          status: "VALIDATED",
        });

        const sort = req.query.sort;

        if (sort === "legendScore") {
            creatures.sort((a, b) => b.legendScore - a.legendScore);
        }

        const legendScore = 1 + validatedCount / 5;

        return {
          ...c.toObject(),
          legendScore,
          validatedCount,
        };
      })
    );

    return res.json(creaturesWithScore);
  } catch (error) {
    return handleCreatureError(res, error);
  }
}


async function getCreatureById(req, res) {
  try {
    const creature = await Creature.findById(req.params.id);
    if (!creature) {
      return res.status(404).json({ message: "Creature non trouvée" });
    }

    const validatedCount = await Testimony.countDocuments({
      creatureId: creature._id,
      status: "VALIDATED",
    });

    const legendScore = 1 + validatedCount / 5;

    return res.json({
      ...creature.toObject(),
      legendScore,
      validatedCount,
    });
  } catch (error) {
    return handleCreatureError(res, error);
  }
}


async function updateCreature(req, res) {
    try {
        const data = pickCreatureData(req.body);
        const creature = await
    Creature.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true, runValidators: true }
    );
    if (!creature) {
        return res.status(404).json({ message: 'Creature unknown....'});
    }
    return res.json(creature);
    } catch (error) {
        return handleCreatureError(res, error);
    }
}

async function deleteCreature(req, res) {
    try {
        const creature = await Creature.findByIdAndDelete(req.params.id);
        if (!creature) {
            return res.status(404).json({ message: 'Creature non trouvée' });
        }
        return res.status(200).end();
    } catch (error) {
        return handleCreatureError(res, error);
    }
}

/* Petites fonctions utilitaires */

function pickCreatureData(body) {
    return {
        name: body.name,
        description: body.description,
        mythology: body.mythology,
    };
}

function handleCreatureError(res, error) {
    console.error('Creature error:', error.message);

    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
        return res.status(400).json({ message: 'The creature name is already used' });
    }

    return res.status(500).json({ message: 'Erreur serveur' });
}

module.exports = {
    createCreature,
    getAllCreature,
    getCreatureById,
    updateCreature,
    deleteCreature,
};