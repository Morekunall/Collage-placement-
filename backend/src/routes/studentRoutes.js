const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');
const upload = require('../middleware/upload');

// All routes require authentication and student role
router.use(authenticate);
router.use(authorize('student'));

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/education', studentController.addEducation);
router.post('/skills', studentController.addSkill);
router.post('/resume/upload', upload.single('resume'), studentController.uploadResume);
router.get('/applications', studentController.getApplications);
router.post('/applications', studentController.applyForJob);

module.exports = router;

