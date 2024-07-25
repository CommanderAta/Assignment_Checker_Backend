const express = require('express');
const { submitSubmission, getSubmissions } = require('../controllers/submissionController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, submitSubmission);
router.get('/:assessmentId', authMiddleware, getSubmissions);

module.exports = router;
