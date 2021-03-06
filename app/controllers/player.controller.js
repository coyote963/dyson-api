const models = require('../models/player.model.js');
const kills = require('../models/dmkill.model.js');
const tdmkills = require('../models/tdmkill.model.js');
var mongoose = require('mongoose');
const chat = require('../models/chat.model.js')
const secrets = require('../../config/database.config')
const http = require('http')
const clb = require('../models/clb.model.js')
// Sanitize user input
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

exports.findAll = (req, res) => {
    req.query.page = req.query.page ? req.query.page : 1
    req.query.size = req.query.size ? req.query.size : 20
    page = parseInt(req.query.page)
    page += 1

    options = {
        page : page,
        limit : req.query.size,
        select : '-ip',
        sort : '-_id'
    }
    models.player.paginate({},options)
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}
exports.activity = async function(req, res) {
    var id = mongoose.Types.ObjectId(req.params.id)

    var svlkill = await models.svlkill.find({killer : id}, 'date_created').exec()
    var dmkill = await kills.find({ $or : [{'killer' : id}, {'victim' : id}]}, 'date_created').exec()
    var tdmkill = await tdmkills.find({ $or : [{'killer' : id}, {'victim' : id}]}, 'date_created').exec()
    var tdmchat = await chat.tdm.find({ player : id }, 'date_created').exec()
    res.send(svlkill.concat(dmkill, tdmkill, tdmchat))
}
exports.findById = (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id)
    models.player.findById(id, '-ip', (err, player ) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(player)
        }

    })
}
exports.findOne = (req, res) => {
    models.player.findById(req.params, '-ip',
        function (err, player) {
            res.send(player)
        }
    )
}

exports.findByName = (req, res) => {
    name = escapeRegExp(req.params.name)
    models.player.find({name: new RegExp(name, "i")})
    .select('-ip')
    .then(players => {
        res.send(players)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}

exports.findSteamAvatar = (req, res) => {
    route = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + secrets.steamkey + "&steamids=" + req.params.steamid
    http.get(route, (response, error ) => {
        if (error) res.send(error)

        var data = ''
        response.setEncoding('utf8')
        response.on('data', function(d) {
            data += d
        })
        response.on('end', function(d) {
            let jsonResp = JSON.parse(data)
            console.log(jsonResp);
            console.log(req.params.steamid);
            try {
                res.send({avatar : jsonResp['response']['players'][0]['avatarfull']})
            }
            catch (err) {
                res.send(err)
            }
        })
    })
}

exports.findAltAccounts = async function(req, res) {
    var id = mongoose.Types.ObjectId(req.params.id)
    var ips = []
    var ids = []
    models.player.findById(id, (err, player ) => {
        if (err) {
            res.status(500).send(err)
        } else {
            ids.unshift(player.id)
            ips.unshift(...player.ip)
            
        }
    })
    .then(async () => {
        while (ips.length > 0) {
            var ip = ips.shift()
            var players = await models.player.find({ ip : ip}).exec();
            for (var x = 0; x < players.length; x++) {
                var p = players[x]
                if (!ids.includes(p.id)) {  ids.push(p.id); }
                for (const newIp in p.ip) {
                    if (newIp !== ip && !ips.includes(newIp)) {
                        ips.push(newIp)
                    }
                }
            }

        }
        res.send(ids)
    })
}


exports.getAllClimbs = (req, res) => {
    clb.aggregate([
        {
          '$sort': {
            'time': 1
          }
        }, {
          '$group': {
            '_id': {
              'map_name': '$map_name', 
              'player': '$player'
            }, 
            'map_id': {
              '$first': '$map_path'
            }, 
            'best_time': {
              '$first': '$time'
            }, 
            'date_created': {
              '$first': '$date_created'
            }
          }
        }, {
          '$lookup': {
            'from': 'players', 
            'localField': '_id.player', 
            'foreignField': '_id', 
            'as': 'player'
          }
        }, {
          '$unwind': {
            'path': '$player'
          }
        }, {
          '$project': {
            'map_name': '$_id.map_name', 
            'map_id': 1, 
            'date_created': 1, 
            'best_time': 1, 
            'names': '$player.name', 
            'player': '$player._id'
          }
        }, {
          '$sort': {
            'best_time': 1
          }
        }, {
          '$group': {
            '_id': '$map_name', 
            'map_id': {
              '$first': '$map_id'
            }, 
            'times': {
              '$push': {
                'names': '$names', 
                'time': '$best_time', 
                'date_created': '$date_created', 
                'player': '$player'
              }
            }
          }
        }
      ]).then(result => res.send(result))
    
}
