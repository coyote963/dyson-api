const CTFProfile = require('../models/ctfprofile.model.js');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.findAll = (req, res) => {
    CTFProfile.paginate({}, {
        page : req.params.page,
    })
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
};


exports.search = (req, res) => {
  req.query.keyword = req.query.keyword ? escapeRegExp(req.query.keyword) : ""
  req.query.page =  req.query.page ? req.query.page : 1
  req.query.size =  req.query.size ? req.query.size : 20

  page = parseInt(req.query.page)
  page += 1
  
  var myAggregate = CTFProfile.aggregate([
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
  if (req.query.sort === 'last_updated') {
    if (req.query.order === 'asc') {
      myAggregate.sort('last_updated')
    } else {
      myAggregate.sort('-last_updated')
    }
  }
  if (req.query.sort === 'captures') {
    if (req.query.order === 'asc') {
      myAggregate.sort('captures')
    } else {
      myAggregate.sort('-captures')
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
        'sigma' : {
            '$lt' : 1
        }
    })
  }
  options = {
    page : page,
    limit : req.query.size,
  }
  CTFProfile.aggregatePaginate(myAggregate, options)
  .then(players => {
      res.send(players)
  })
  .catch(err => {
      res.status(500).send(err)
  })
}



exports.findUser = async (req, res) => {
    try {
        userId = {
            "player.platform" : req.params.platform,
            "player.profile" : req.params.profile
        }
        var result = await CTFProfile.find(userId).exec();
        res.send( result )
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.findFullUser = async (req, res) => {
    try {
        userId = {
            "player.platform" : req.params.platform,
            "player.profile" : req.params.profile
        }
        var result = await CTFProfile
            .find(userId)
            .populate('player', 'color name premium hat')
            .exec();
        res.send( result )
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.findRankings = (req, res) => {
    options = {page : req.params.page}
    var agg = CTFProfile.aggregate([
        {
          '$lookup': {
            'from': 'players', 
            'localField': 'player', 
            'foreignField': '_id', 
            'as': 'newplayer'
          }
        }, {
          '$project': {
            'player.platform': 1, 
            'mu': 1, 
            'sigma': 1, 
            'first': {
              '$arrayElemAt': [
                '$newplayer', 0
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0, 
            'mu': 1, 
            'sigma': 1, 
            'result': {
              '$subtract': [
                '$mu', {
                  '$multiply': [
                    3, '$sigma'
                  ]
                }
              ]
            }, 
            'name': {
              '$arrayElemAt': [
                '$first.name', 0
              ]
            }
          }
        }, {
          '$sort': {
            'result': -1
          }
        }
      ])
    CTFProfile.aggregatePaginate(agg, options)
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}

exports.findById = async (req, res) => {
  console.log(req.params.id)
  var player = await CTFProfile.findOne({player : req.params.id})
  if (!player) {
    res.send("player not found")
  } else {
    var myAggregate = [{
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
          'rating': {
            '$gt': player.mu - 3 * player.sigma
          }
        }
      }, {
        '$count': 'rank'
      }
    ]
    var total = await CTFProfile.countDocuments()
    var rank = await CTFProfile.aggregate(myAggregate).catch(err => {
      res.status(500).send(err)
    })
    rank = rank[0]['rank']
    res.send({
      profile : player,
      total : total,
      ranking : rank,
      percentile : 100 * ( total - rank ) / total
    })
  }
}