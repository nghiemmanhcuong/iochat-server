const express = require('express');
const router = express.Router();
const messageControler = require('../controllers/messageController.js');

router.post('/',messageControler.addMessage);
router.get('/:chatId',messageControler.getMessages);

module.exports = router;