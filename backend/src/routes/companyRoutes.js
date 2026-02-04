const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const companyController = require('../controllers/companyController');

// All routes require authentication and company role
router.use(authenticate);
router.use(authorize('company'));

router.get('/profile', companyController.getProfile);
router.put('/profile', companyController.updateProfile);
router.get('/jobs', companyController.getJobs);
router.post('/jobs', companyController.createJob);
router.put('/jobs/:jobId', companyController.updateJob);
router.delete('/jobs/:jobId', companyController.deleteJob);
router.get('/jobs/:jobId/applications', companyController.getJobApplications);
router.put('/jobs/:jobId/applications/:applicationId/status', companyController.updateApplicationStatus);

module.exports = router;

