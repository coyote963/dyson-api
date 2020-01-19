var express = require('express');
var router = express.Router();
var playerController = require('../controllers/player.controller.js');
router.get('/:profile/platform/:platform', playerController.findOne);
router.get('/name/:name', playerController.findByName);
router.get('/:page', playerController.findAll );
router.get('/', playerController.findAll );
module.exports = router;