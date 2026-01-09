const mongoose = require('mongoose');

function buildTestimonySchema() {
    return new mongoose.Schema({
        creatureId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Creature',
            required: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 50,
        },
        location: {
            type: String,
            default: 'unknown',
        },
        witnessName: {
            type: String,
            default: 'anonymous',
        },
        status: {
            type: String,
            enum: ['pending', 'validated', 'rejected'],
            default: 'pending',
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        validationTime: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    })
}