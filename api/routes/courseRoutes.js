const express = require('express');
const { createCourse, getCourses } = require('../controllers/courseController');
const { authMiddleware, professorMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, professorMiddleware, createCourse);
router.get('/', authMiddleware, professorMiddleware, getCourses);

module.exports = router;