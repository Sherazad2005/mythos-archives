const express = require('express');
const router = express.Router();
const testimonyController = require('../controllers/testimony.controllers');

router.post('/', testimonyController.createTestimony);

router.get('/', testimonyController.getAllTestimonies);

router.put('/:id/validate', testimonyController.validateTestimony);

router.put('/:id/reject', testimonyController.rejectTestimony);

module.exports = router;