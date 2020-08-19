const models = require('../models/player.model.js');
const kills = require('../models/dmkill.model.js');
const tdmkills = require('../models/tdmkill.model.js');
var mongoose = require('mongoose');
const chat = require('../models/chat.model.js')
const secrets = require('../../config/database.config')
const http = require('http')
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
        select : '-ip'
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
            res.send({avatar : jsonResp['response']['players'][0]['avatarfull']})
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