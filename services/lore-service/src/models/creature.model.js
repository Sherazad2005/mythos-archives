const mongoose = require('mongoose');

function buildCreatureSchema() {
    return new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 20,
        },
        mythology: {
            type: String,
            default: 'unknown',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    });
}

function createCreatureModel() {
    const creatureSchema =
buildCreatureSchema();
return mongoose.model('Creature', creatureSchema);
}

const Creature = createCreatureModel();
module.exports = Creature;