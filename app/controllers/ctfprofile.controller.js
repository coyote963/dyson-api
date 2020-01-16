const CTFProfile = require('../models/ctfprofile.model.js');

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