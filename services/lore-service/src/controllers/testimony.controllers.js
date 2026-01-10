const Testimony = require("../models/testimony.model");
const Creature = require("../models/creature.model");

const {
    checkFiveBetweenTestimony,
    noSelfValidation,
} = require('../services/testimonyRules');

// créer un témoignage
async function creatTestimony(req, res) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(401).json({ message: "Accès refusé : token manquant" });

    await checkFiveBetweenTestimony(userId); 

    const data = buildTestimonyData(req.body, userId);
    const testimony = await Testimony.create(data);
    return res.status(201).json(testimony);
  } catch (error) {
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
        noSelfValidation(testimony, userId);
        await applyValidationOnTestimony(testimony, userId); 
        await incrementCreatureEvolution(testimony.creatureId);

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

        testimony.status = "REJECTED";
        testimony.validatedBy = userId;
        testimony.validatedAt  = new Date();
        await testimony.save();

        return res.json(testimony);
    }catch (error) {
        return handleTestimonyError(res, error);
    }
}

//autres fonctions utilitaires comme avec creature controller

function getUserIdFromRequest(req) {
  const id = req.user?.id;
  return id ? Number(id) : null;
}


function buildTestimonyData(body, userId) {
    return{
        creatureId: body.creatureId,
        authorId: userId,
        description: body.description,
        status: "PENDING",
        validatedBy: null,
        validatedAt: null,
        };
}

function buildTestimonyFilter(query) {
    const filter = {};
        if (query.status) filter.status = query.status;
        if (query.creatureId) filter.creatureId = query.creatureId;
        if (query.authorId) filter.authorId = Number(query.authorId);
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
        testimony.status = 'VALIDATED';
        testimony.validatedBy = userId;
        testimony.validatedAt  = new Date();
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
        creatTestimony,
        getAllTestimonyFilter,
        validateTestimony,
        rejectTestimony,
    };