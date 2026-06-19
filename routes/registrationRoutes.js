const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { verifyToken, verifyStudent, verifyAdmin } = require('../middleware/authMiddleware');

// Student routes
router.post('/registrations', verifyToken, verifyStudent, registrationController.registerEvent);
router.delete('/registrations/:registrationId', verifyToken, verifyStudent, registrationController.unregisterEvent);

// Admin routes
router.get('/listRegistrations', verifyToken, verifyAdmin, registrationController.listRegistrations);
router.get('/getRegistrationsByDate', verifyToken, verifyAdmin, registrationController.getRegistrationsByDate);

module.exports = router;
