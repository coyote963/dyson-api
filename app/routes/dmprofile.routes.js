var express = require('express');
var router = express.Router();
var dmprofileController = require('../controllers/dmprofile.controller.js');
router.get('/full/:profile/platform/:platform',dmprofileController.findOneWithInfo);
router.get('/:profile/platform/:platform', dmprofileController.findOne);
router.get('/rankings', dmprofileController.findRankings)
router.get('/rankings/:page', dmprofileController.findRankings)
router.get('/id/:id', dmprofileController.findById)
router.get('/', dmprofileController.findAll);
router.get('/search', dmprofileController.search);
module.exports = router;