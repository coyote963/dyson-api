var express = require('express');
var router = express.Router();
var dmprofileController = require('../controllers/dmprofile.controller.js');
router.get('/:profile/store/:platform', dmprofileController.findOne);
router.get('/', dmprofileController.findAll );
module.exports = router;