const verifyTokenViaAuth = require("../middlewares/verifyTokenViaAuth");
const express = require('express');
const router = express.Router();
const creatureController = require("../controllers/creature.controller");



//Create

router.post("/", verifyTokenViaAuth, creatureController.createCreature);

//ensuite Read all

router.get('/', creatureController.getAllCreature);

// Read one

router.get('/:id', creatureController.getCreatureById);

// update (un peu chiant niveau syntaxe faut que j'y revienne après)

router.put('/:id', verifyTokenViaAuth, creatureController.updateCreature);

//Delete

router.delete('/:id', verifyTokenViaAuth, creatureController.deleteCreature);

module.exports = router;

// Une ligne = une action HTTP + un chemin + une fonction normalement ça devrait être assez simple pour pas m'embrouiller 