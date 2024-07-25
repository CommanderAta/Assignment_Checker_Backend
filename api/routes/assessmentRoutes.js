const express = require('express');
const { createAssessment, getAssessments } = require('../controllers/assessmentController');
const { authMiddleware, professorMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, professorMiddleware, createAssessment);
router.get('/:courseId', authMiddleware, getAssessments);

module.exports = router;
