const express = require('express');
const { createCourse, getCourses, getCourseById } = require('../controllers/courseController');
const { authMiddleware, professorMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, professorMiddleware, createCourse);
router.get('/', authMiddleware, getCourses);
router.get('/:courseId', authMiddleware, getCourseById);

module.exports = router;
