const DMProfile = require('../models/dmprofile.model.js');
// Sanitize user input
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

exports.findAll = (req, res) => {
  req.query.page =  req.query.page ? req.query.page : 1
  req.query.size =  req.query.size ? req.query.size : 20
  if (req.query.page < 1) {
    req.query.page = 1
  }
  DMProfile.paginate({},{ page : req.params.page,
    populate : {
      path : 'player',
      select : 'name color premium hat'
    },
    page : req.query.page,
    limit : req.query.size
  })
  .then(result => {
      res.send(result)
  })
  .catch(err => {
      res.status(500).send(err)
  })
}

exports.search = (req, res) => {
  req.query.keyword = req.query.keyword ? escapeRegExp(req.query.keyword) : ""
  req.query.page =  req.query.page ? req.query.page : 1
  req.query.size =  req.query.size ? req.query.size : 20

  page = parseInt(req.query.page)
  page += 1
  
  var myAggregate = DMProfile.aggregate([
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
            '$lt' : 1
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
  options = {
    page : page,
    limit : req.query.size,
  }
  DMProfile.aggregatePaginate(myAggregate, options)
  .then(players => {
      res.send(players)
  })
  .catch(err => {
      res.status(500).send(err)
  })
}


exports.findOne = async (req, res) => {
    try {
        var result = await DMProfile.find({
            "player.platform" : req.params.platform,
            "player.profile" : req.params.profile}).exec();
        res.send(result)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.findOneWithInfo = async (req, res) => {
    try {
        userId = {
            "player.platform" : req.params.platform,
            "player.profile" : req.params.profile}
        var result = await DMProfile.find(userId)
        .populate('player', 'color name premium hat')
        .exec();
        res.send(result)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.findRankings = (req, res) => {
    var myAggregate = DMProfile.aggregate([
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
        }, {
          '$match': {
            'sigma': {
              '$lt': 1
            }
          }
        }
      ]);
    
    const options = {
        page: req.params.page,
        limit: 10
    };
    DMProfile.aggregatePaginate(myAggregate, options)
    .then(players => {
        res.send(players)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}


exports.findById = async (req, res) => {
  var profile = await DMProfile.findOne({player : req.params.id});
  if (!profile) {
    res.status(404).send("Could not locate this player");
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
            '$gt': profile.mu - 3 * profile.sigma
          }
        }
      }, {
        '$count': 'rank'
      }
    ]
    var total = await DMProfile.countDocuments()
    DMProfile.aggregate(myAggregate)
    .then(result => {
      if (result.length === 0) {
        res.send({
          profile : profile,
          total : total,
          ranking : 1,
          percentile : 100
        })
      } else {
        rank = result[0]['rank']
        res.send({
          profile : profile,
          total : total,
          ranking : rank,
          percentile : 100 * ( total - rank ) / total
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
    
  }
}