const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.js');

router.post('/', chatController.createChat);
router.get('/:userId', chatController.userChats);
router.get('/find/:firstId/:secondId', chatController.findChat);

module.exports = router;
