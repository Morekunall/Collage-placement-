const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Public routes - no authentication required
router.get('/', jobController.getJobs);
router.get('/:jobId', jobController.getJobById);

module.exports = router;

