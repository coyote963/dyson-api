const Players = require('../models/player.model.js');

// Sanitize user input
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

exports.findAll = (req, res) => {
    Players.find({}, function (err, users) {
        res.send(users)
    })
}

exports.findOne = (req, res) => {
    Players.findById(req.params, '-ip',
        function (err, player) {
            res.send(player)
        }
    )
}

exports.findByName = (req, res) => {
    name = escapeRegExp(req.params.name)
    console.log(name)
    Players.find({name: new RegExp(name, "i")})
    .exec((err, users) => {
        res.send(users)
    })
}

