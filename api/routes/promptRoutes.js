const express = require('express');
const promptController = require('../controllers/promptController');

const router = express.Router();

router.post('/prompt', promptController.upload.single('file'), promptController.prompt);

module.exports = router;
