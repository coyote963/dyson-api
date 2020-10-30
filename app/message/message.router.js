var express = require('express');

var router = express.Router();

var messageController = require('./message.controller');

router.get('/', messageController.getMessage)

module.exports = router