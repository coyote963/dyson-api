var express = require('express');
var router = express.Router();
var dmkillsController = require('../controllers/dmkill.controller.js')

router.get('/match/:match', dmkillsController.findMatch)
router.get('/full/:page', dmkillsController.findFullPage)
router.get('/:page', dmkillsController.findPage)
router.get('/', dmkillsController.findRecent)
module.exports = router