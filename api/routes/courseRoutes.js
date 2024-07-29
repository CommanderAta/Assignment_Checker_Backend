const express = require('express');
const { createCourse, updateCourse, getCourses, getCourseById } = require('../controllers/courseController');
const { authMiddleware, professorMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, professorMiddleware, createCourse); // Ensure the endpoint exists for creating courses
router.put('/:courseId', authMiddleware, professorMiddleware, updateCourse); // Ensure the endpoint exists for updating courses
router.get('/', authMiddleware, getCourses); // Ensure the endpoint exists for fetching all courses
router.get('/:courseId', authMiddleware, getCourseById); // Ensure the endpoint exists for fetching a specific course by ID

module.exports = router;
