const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminWebController');

// Admin home
router.get('/', adminController.adminHome);

// Approve or reject a mentor
router.post('/update-mentor-status', adminController.updateMentorStatus);

// Manage reported mentors
router.post('/manage-reported-mentor', adminController.manageReportedMentor);

module.exports = router;
