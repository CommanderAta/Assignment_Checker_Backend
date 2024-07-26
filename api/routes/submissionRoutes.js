const express = require('express');
const { submitSubmission, getSubmissions, getSubmissionDetails } = require('../controllers/submissionController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, submitSubmission);
router.get('/:assessmentId', authMiddleware, getSubmissions);
router.get('/details/:submissionId', authMiddleware, getSubmissionDetails); // Add this line

module.exports = router;
