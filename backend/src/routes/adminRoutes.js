const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/companies/pending', adminController.getPendingCompanies);
router.post('/companies/:companyId/verify', adminController.verifyCompany);
router.post('/companies/:companyId/reject', adminController.rejectCompany);
router.get('/students', adminController.getStudents);

module.exports = router;

