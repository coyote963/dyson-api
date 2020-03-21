var express = require('express');
var router = express.Router();
var playerController = require('../controllers/player.controller.js');
router.get('/:profile/platform/:platform', playerController.findOne);
router.get('/name/:name', playerController.findByName);
router.get('/activity/:id', playerController.activity);
router.get('/id/:id', playerController.findById);
router.get('/:page', playerController.findAll );
router.get('/', playerController.findAll );
router.get('/avatar/:steamid', playerController.findSteamAvatar)
module.exports = router;