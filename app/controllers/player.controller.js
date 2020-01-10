const Players = require('../models/player.model.js');

exports.findAll = (req, res) => {
    Players.find({}, function (err, users) {
        res.send(users)
    })
}
