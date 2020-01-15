var express = require('express');
var router = express.Router();
var dmprofileController = require('../controllers/dmprofile.controller.js');
router.get('/full/:profile/platform/:platform',dmprofileController.findOneWithInfo);
router.get('/:profile/platform/:platform', dmprofileController.findOne);
router.get('/', dmprofileController.findAll);
module.exports = router;