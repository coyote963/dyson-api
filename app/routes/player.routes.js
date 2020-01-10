var express = require('express');
var router = express.Router();
var playerController = require('../controllers/player.controller.js');
router.get('/:profile/store/:platform', playerController.findOne);
router.get('/name/:name', playerController.findByName);
router.get('/', playerController.findAll );
module.exports = router;