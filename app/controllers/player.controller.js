const Players = require('../models/player.model.js');

// Sanitize user input
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

exports.findAll = (req, res) => {
    options = {
        page : req.params.page
    }
    Players.paginate({},options)
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
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
    .select('-ip')
    .then(players => {
        res.send(players)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}
