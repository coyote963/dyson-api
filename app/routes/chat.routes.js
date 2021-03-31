var express = require('express');
var router = express.Router();
var chatController = require('../controllers/chat.controller.js');
router.get('/random', chatController.random)
router.get('/:mode/search/:searchterm', chatController.findKeyword)
router.get('/:mode/context/:chatId', chatController.findContext);
router.get('/:mode/:profile/platform/:platform/:page', chatController.findUser);
router.get('/:mode/:profile/platform/:platform/', chatController.findUser);
router.get('/:mode/:page', chatController.findAll);
router.get('/:mode', chatController.findAll);
module.exports = router;