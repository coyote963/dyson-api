var express = require('express');
var router = express.Router();
var loadoutsController = require('./loadouts.controller')

router.get('/:id', loadoutsController.findLoadouts);

module.exports = router;