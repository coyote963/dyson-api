var express = require('express');

var router = express.Router();

var messageController = require('./message.controller');

router.get('/', messageController.fetchMessages)
router.get('/pm/:sender/:recipient', messageController.fetchPrivateChat)
router.get('/inbox/:sender', messageController.fetchDifferentUsers)
module.exports = router