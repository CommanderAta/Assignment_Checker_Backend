const express = require('express');
const { signup, login, getUserRole, getUserProfile, getEnrolledCourses, enrollInCourse } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/role', authMiddleware, getUserRole);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/enrolled-courses', authMiddleware, getEnrolledCourses);
router.post('/enroll', authMiddleware, enrollInCourse);

module.exports = router;
