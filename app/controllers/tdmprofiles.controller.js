const TDMProfile= require('../models/tdmprofile.model');
const TDMKill = require('../models/tdmkill.model');
const TDMRound = require('../models/tdmround.model');
const Player = require('../models/player.model').player;
const {
  ObjectId
} = require('mongodb');
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

exports.findById = async (req, res) => {
    var profile = await TDMProfile.findOne({player : req.params.id});
    if (!profile) {
        res.status(404).send("can't locate that player");
        return;
    }
    var x = await TDMProfile.find({}).count()
    var y = await TDMProfile.find(
        {elo : { $lte : profile.elo}
    }).countDocuments()
    res.send({profile : profile, percentile: y * 100.0 / x, ranking : x - y, total : x})
}

exports.search = (req, res) => { 
    req.query.keyword = req.query.keyword ? escapeRegExp(req.query.keyword) : ""
    req.query.page = req.query.page ? req.query.page : 1
    req.query.size = req.query.size ? req.query.size : 20

    page = parseInt(req.query.page)
    page += 1
    var myAggregate = TDMProfile.aggregate([
        {
          '$lookup': {
            'from': 'players', 
            'localField': 'player', 
            'foreignField': '_id', 
            'as': 'player'
          }
        }, {
          '$project': {
            'player.ip': 0
          }
        }, {
          '$addFields': {
            'rating': {
              '$subtract': [
                '$mu', {
                  '$multiply': [
                    3, '$sigma'
                  ]
                }
              ]
            }
          }
        }, {
          '$match': {
            'player.name': new RegExp(req.query.keyword, "i")
          }
        }
    ])
    if (req.query.sort === '') {
        myAggregate.sort('-rating')
      }
    if (req.query.sort === 'rating') {
        if (req.query.order === 'asc') {
          myAggregate.sort('rating')
        } else {
          myAggregate.sort('-rating')
        }
    }
    if (req.query.sort === 'kills') {
        if (req.query.order === 'asc') {
            myAggregate.sort('kills')
        } else {
            myAggregate.sort('-kills')
        }
    }
    if (req.query.sort === 'deaths') {
        if (req.query.order === 'asc') {
            myAggregate.sort('deaths')
        } else {
            myAggregate.sort('-deaths')
        }
    }
    if (req.query.sort === 'wins') {
        if (req.query.order === 'asc') {
            myAggregate.sort('wins')
        } else {
            myAggregate.sort('-wins')
        }
    }
    if (req.query.sort === 'losses') {
        if (req.query.order === 'asc') {
            myAggregate.sort('losses')
        } else {
            myAggregate.sort('-losses')
        }
    }
    if (req.query.sort === 'last_updated') {
        if (req.query.order === 'asc') {
            myAggregate.sort('last_updated')
        } else {
            myAggregate.sort('-last_updated')
        }
    }
    if (req.query.active === 'true') {
        var cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30)
        myAggregate.match({
            '$and' : [
                {
                  'last_updated' : {
                    '$gt' : cutoff
                  }
                }, {
                  'sigma' : {
                    '$lt' : 1.66
                  }
                }
            ]
        })
    }
    if (req.query.accurate === 'true') {
        myAggregate.match({
            'mu' : {
                '$lt' : 1
            }
        })
    }
    const options = {
        page: page,
        limit: 10
    };
    TDMProfile.aggregatePaginate(myAggregate, options)
    .then(players => {
        res.send(players)

    }).catch(err => {
        res.status(500).send(err)
    })
}


exports.findFavoriteWeapons = async (req, res) => {
  TDMKill.aggregate([
    {
      '$match': {
        'killer': new ObjectId(req.params.id)
      }
    }, {
      '$group': {
        '_id': '$weapon', 
        'frequency': {
          '$sum': 1
        }
      }
    }, {
      '$sort': {
        'frequency': -1
      }
    }
  ]).then(results => {
    res.send(results)
  })
}

exports.mapWinrates = async (req, res) => {
  const wincounts = await TDMRound.aggregate([
    {
      '$match': {
        '$or': [
          {
            '$and': [
              {
                'man_players': new ObjectId(req.params.id)
              }, {
                'result': '2'
              }
            ]
          }, {
            '$and': [
              {
                'usc_players': new ObjectId(req.params.id)
              }, {
                'result': '1'
              }
            ]
          }
        ]
      }
    }, {
      '$group': {
        '_id': '$map_name', 
        'frequency': {
          '$sum': 1
        }
      }
    
    }
  ]).exec()
  const losecounts = await TDMRound.aggregate([
    {
      '$match': {
        '$or': [
          {
            '$and': [
              {
                'man_players': new ObjectId(req.params.id)
              }, {
                'result': '1'
              }
            ]
          }, {
            '$and': [
              {
                'usc_players': new ObjectId(req.params.id)
              }, {
                'result': '2'
              }
            ]
          }
        ]
      }
    }, {
      '$group': {
        '_id': '$map_name', 
        'frequency': {
          '$sum': 1
        }
      }
    }
  ]).exec()

  var wins = {}
  var losses = {}
  var results = {}
  wincounts.forEach(function(item) {
    wins[item._id] = item.frequency
  })
  losecounts.forEach(function(item) {
    losses[item._id] = item.frequency
  })
  console.log(losses)
  console.log(wins)
  for (const key in wins) {
    if (key in losses) {
      results[key] = {rate: wins[key] / (wins[key] + losses[key]), games: wins[key] + losses[key]}
    }
  }
  var winrateList = []
  for (const key in results) {
    winrateList.push({
      map : key,
      rate : results[key].rate,
      games : results[key].games
    })
  }
  res.send(winrateList)
}

exports.getKills = (req, res) => {
  TDMKill.find({
    '$or': [
      {
        'killer': new ObjectId(req.params.id)
      }, {
        'victim': new ObjectId(req.params.id)
      }
    ]
  })
  .sort({ _id : -1})
  .populate('killer')
  .populate('victim')
  .then(result => {
    res.send(result)
  })
}

exports.getRatingHistory = (req, res) => {
  TDMKill.aggregate([
    {
      '$match': {
        '$or': [
          {
            'killer': new ObjectId(req.params.id)
          }, {
            'victim': new ObjectId(req.params.id)
          }
        ]
      }
    }, {
      '$addFields': {
        'isPlayer': {
          '$cond': {
            'if': {
              '$eq': [
                '$killer', new ObjectId(req.params.id)
              ]
            }, 
            'then': true, 
            'else': false
          }
        }
      }
    }, {
      '$project': {
        'isPlayer': 1, 
        'date_created': 1, 
        'killer_rating': 1, 
        'victim_rating': 1
      }
    }
  ])
  .then(kills => {
    var history = kills
    .map(kill => {
      var newKill = kill
      if (typeof kill.killer_rating === 'object') {
        newKill.killer_rating = kill.killer_rating.elo
        newKill.victim_rating = kill.victim_rating.elo
      }
      return newKill
    }) 
    .map(kill => {
      var takenRating = kill.isPlayer ? kill.killer_rating : kill.victim_rating
      timestamp = kill._id.toString().substring(0,8)
      return {
        name :  new Date( parseInt( timestamp.substring(0,8), 16 ) * 1000 ),
        value : takenRating
      }
    })
    res.send([{
      name : "Player",
      series : history
    }])
  })
}

exports.getMostPlayed = async (req, res) => {
  var plays = [];
  TDMKill.aggregate([
    {
        '$match': {
            '$or': [
                {
                    'killer': ObjectId(req.params.id)
                }, {
                    'victim': ObjectId(req.params.id)
                }
            ]
        }
    }, {
        '$addFields': {
            'otherPlayer': {
                '$cond': {
                    'if': {
                        '$eq': [
                            '$killer', ObjectId(req.params.id)
                        ]
                    }, 
                    'then': '$victim', 
                    'else': '$killer'
                }
            }
        }
    }, {
        '$group': {
            '_id': '$otherPlayer', 
            'interactionCount': {
                '$sum': 1
            }
        }
    }, {
        '$sort': {
            'interactionCount': -1
        }
    }, {
        '$limit': 6
    }
  ]).then(async mostPlayedPlayers => {
    const promises = mostPlayedPlayers.map(async playerMU => {
      var x = await TDMKill.find({killer : new ObjectId(req.params.id) , victim : new ObjectId(playerMU._id)}).countDocuments().exec()
      var player = await Player.findById(new ObjectId(playerMU._id)).exec();
      plays.push({
        _id : player._id,
        name : player.name[0],
        winrate : x / playerMU.interactionCount,
        total : playerMU.interactionCount
      })
    })
    await Promise.all(promises);
    res.send(plays)
  })
}