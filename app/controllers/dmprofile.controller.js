const DMProfile = require('../models/dmprofile.model.js');


exports.findAll = async (req, res) => {
    try {
        var result = await DMProfile.find().exec();
        res.send(result)
    } catch (err) {
        res.status(500).send(err)
    }
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
