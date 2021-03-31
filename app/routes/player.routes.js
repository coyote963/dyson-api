var express = require('express');
var router = express.Router();
var playerController = require('../controllers/player.controller.js');
const { player } = require('../models/player.model.js');
//players

router.get('/climbs', playerController.getAllClimbs)
router.get('/:profile/platform/:platform', playerController.findOne);
router.get('/name/:name', playerController.findByName);
router.get('/activity/:id', playerController.activity);
router.get('/id/:id', playerController.findById);
router.get('/:page', playerController.findAll );
router.get('/', playerController.findAll );
router.get('/avatar/:steamid', playerController.findSteamAvatar)
router.get('/altaccounts/:id', playerController.findAltAccounts);
module.exports = router;