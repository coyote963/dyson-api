const Players = require('../models/player.model.js');

// Sanitize user input
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

exports.findAll = (req, res) => {
    req.query.page = req.query.page ? req.query.page : 1
    req.query.size = req.query.size ? req.query.size : 20
    if (req.query.page < 1) {
        req.query.page = 1
    }

    options = {
        page : req.query.page,
        limit : req.query.size,
        select : '-ip'
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
    Players.find({name: new RegExp(name, "i")})
    .select('-ip')
    .then(players => {
        res.send(players)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}


