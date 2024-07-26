const express = require('express');
const promptController = require('../controllers/promptController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/prompt', authMiddleware, promptController.upload.single('file'), promptController.prompt);

module.exports = router;
