const Creature =
require('../models/creature.model');

async function creatCreature(req, res) {
    try {
        const data = pickCreatureData(req.body);
        const creature = await 
    Creature.create(data);
    return res.status(201).json(creature);
    } catch(error) {
        return handleCreatureError(res, error);
    }
}

async function getAllCreatureError(req, res) {
    try {
        const creatures = await Creature.find();
        return res.json(creature);
    }catch (error) {
        return handleCreatureError(res, error);
    }
}

async function getCreatureById(req, res) {
    try {
        const creature = await
    Creature.findById(req.params.id);
        if (!creature) {
            return res.status(404).json({ message: 'Creature non trouvée' });
        }
        return res.json(creature);
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

/* Petites fonctions utilitaires */

function pickCreatureData(body) {
    return {
        name: body.name,
        description: body.description,
        mythology: body.mythology,
    };
}

function handleCreatureError(res, error) {
    console.error('Creature error:', error.meesage);

    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
        return res.status(400).json({ message: 'The creature name is already used' });
    }

    return res.stat(500).json({ message: 'Erreur serveur' });
}

module.exports = {
    createCreature,
    getAllCreature,
    getCreatureById,
    updateCreature,
    deleteCreature,
};