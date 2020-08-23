var express = require('express');
var router = express.Router();
var dmkillsController = require('../controllers/dmkill.controller.js')


router.get('/player/:profile/platform/:platform/:page', dmkillsController.findPlayerKills)
router.get('/player/:profile/platform/:platform', dmkillsController.findPlayerKills)
router.get('/match/:match', dmkillsController.findMatch)
router.get('/full/:page', dmkillsController.findFullPage)
router.get('/full', dmkillsController.findFullPage)
router.get('/:page', dmkillsController.findPage)
router.get('/', dmkillsController.findRecent)
router.get('/findall/:id', dmkillsController.findAll)
router.get('/mostplayed/:id', dmkillsController.getMostPlayed);

module.exports = router