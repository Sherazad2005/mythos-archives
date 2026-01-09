const Testimony = require('../models/creature.model');
const Creature = require('../models/creature.model');
const {
    checkFiveBetweenTestimony,
    noSelfValidation,
} = require('../services/testimonyRules');

// créer un témoignage
async function creatTestimony(req, res) {
    try{
        const userId = getUserIdFromRequestr(req);
        await checkFiveBetweenTestimony(userId);

        const data = buildTestimonyData(req.body, userId);
    } catch(error) {
        return handleTestimonyError(res, error);
    }
}

// lire tous les témoignage
async function getAllTestimonyFilter(req, res) {
    try {
        const filter = buildTestimonyFilter(req.query);
        const testimonies = await Testimony.find(filter);
        return res.json(testimonies);
    } catch(error) {
        return handleTestimonyError(res, error);
    }
}

// Valider un témoignage
async function validateTestimony(req, res) {
    try{
        const userId = getUserIdFromRequest(req);
        const testimony = await findTestimonyOr404(req.params.id, res);
        
        if (!testimony) return;
        noSelfValidation(testimony, userId); await applyValidationOnTestimony(testimony, userId); await incrementCreatureEvolution(testimony.creatureId);

        return res.json (testimony);
    }catch (error) {
        return handleTestimonyError(res, error);
    }
}

//rejet
async function rejectTestimony(req, res) {
    try {
        const userId = getUserIdFromRequest(req);
        const testimony = await findTestimonyOr404(req.params.id, res);
        if (!testimony) return;

        noSelfValidation(testimony, userId);

        testimony.status = 'rejected';
        testimony.validatedBy = userId;
        testimony.validationTime = new Date();
        await testimony.save();

        return res.json(testimony);
    }catch (error) {
        return handleTestimonyError(res, error);
    }
}

//autres fonctions utilitaires comme avec creature controller

function getUserIdFromRequest(req){
    return req.user ? req.user._id : null;
}

function buildTestimonyData(body, userId) {
    return{
        creatureId: body.creatureId,
        description: body.description,
        location: body.location,
        WitnessName: body.WitnessName,
        submittedBy:userId,
        };
}

function buildTestimonyFilter(query) {
    const filter = {;
        if (query.status) filter.status = query.creatureId;
        return filter;
    }
    async function findTestimonyOr404(id, res) {
        const testimony = await Testimony.findById(id);
        if (!testimony) {
            res.status(404).json({ message: 'Témoignage non trouvé'});
            return null;
        }
        return testimony;
    }

    async function applyValidationOnTestimony(testimony, userId) {
        testimony.status = 'validated';
        testimony.validatedBy = userId;
        testimony.validationTime = new Date();
        await testimony.save();
    }

    async function incrementCreatureEvolution(creatureId) {
        await Creature.findByIdAndUpdate(
            creatureId,
            { $inc: { evolutionScore: 1,
                validatedTestimonies: 1 } },
                { new: true }
        );
    }

    function handleTestimonyError(res, error) {
        console.error('Testimony error', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message:error.message});
        }

        return res.status(400).json({ message: error.message});
    }

    module.exports = {
        createTestimony,
        getAllTestimonies,
        validateTestimony,
        rejectTestimony,
    };