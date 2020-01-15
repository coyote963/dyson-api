var express = require('express');
var router = express.Router();
var ctfprofileController = require('../controllers/ctfprofile.controller.js')

router.get('/:profile/platform/:platform', ctfprofileController.findUser);
router.get('/full/:profile/platform/:platform', ctfprofileController.findFullUser);
router.get('/:page', ctfprofileController.findAll);
router.get('/', ctfprofileController.findAll);

module.exports = router