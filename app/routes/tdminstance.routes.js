var express = require('express');
var router = express.Router();
var tdmInstanceController = require('../controllers/tdminstance.controller.js');

router.get('/full/:page', tdmInstanceController.findAllFull);
router.get('/full', tdmInstanceController.findAllFull);
router.get('/', tdmInstanceController.findAll);
router.get('/:page', tdmInstanceController.findAll);
module.exports = router;