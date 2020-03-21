var express = require('express');
var router = express.Router();
var tdmProfileController = require('../controllers/tdmprofiles.controller')
router.get('/search', tdmProfileController.search);
router.get('/id/:id', tdmProfileController.findById);
module.exports = router;