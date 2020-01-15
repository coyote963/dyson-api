var express = require('express');
var router = express.Router();
var ctfinstanceController = require('../controllers/ctfinstance.controller.js');

router.get('/', ctfinstanceController.findAll);
router.get('/:page', ctfinstanceController.findAll);
router.get('/:profile/platform/:platform', ctfinstanceController.findUser);
router.get('/match/:match', ctfinstanceController.findMatch);
module.exports = router;