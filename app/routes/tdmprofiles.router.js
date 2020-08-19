var express = require('express');
var router = express.Router();
var tdmProfileController = require('../controllers/tdmprofiles.controller');
const { tdm } = require('../models/chat.model');
router.get('/search', tdmProfileController.search);
router.get('/id/:id', tdmProfileController.findById);
router.get('/weapons/:id', tdmProfileController.findFavoriteWeapons);
router.get('/maps/:id', tdmProfileController.mapWinrates);
router.get('/kills/:id', tdmProfileController.getKills)
router.get('/history/:id', tdmProfileController.getRatingHistory);
router.get('/mostplayed/:id', tdmProfileController.getMostPlayed);
module.exports = router;