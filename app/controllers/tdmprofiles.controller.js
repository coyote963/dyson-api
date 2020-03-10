const TDMProfile= require('../models/tdmprofile.model');
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
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
            'last_updated' : {
                '$gt' : cutoff
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