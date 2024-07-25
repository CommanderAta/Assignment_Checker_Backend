const express = require('express');
const { signup, login, getUserRole } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/role', authMiddleware, getUserRole);

module.exports = router;
