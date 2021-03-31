var express = require('express');
var router = express.Router();
var clanController = require('./clan.controller');
router.get('/', clanController.getAllClans)
router.get('/leaderboard', clanController.getLeaderboard)
router.get('/:clanId', clanController.getDescription)
router.post('/comments', clanController.addClanComment)
router.get('/comments', clanController.getAllComments)
router.get('/comments/:clanId', clanController.getClanComments)
module.exports = router;