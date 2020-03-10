var express = require('express');
var router = express.Router();
var tdmProfileController = require('../controllers/tdmprofiles.controller')
router.get('/search', tdmProfileController.search);

module.exports = router;