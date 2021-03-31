const DMKills = require('../models/dmkill.model.js');
const {ObjectId} = require('mongodb');
const Player = require('../models/player.model').player;

exports.findPage = (req, res) => {
    DMKills.paginate({}, {page : req.params.page}, function(err, result) {
        res.send(result)
    })
};

exports.findRecent = (req, res) => {
    DMKills.paginate({}, {
        page : req.params.page,
        sort : { date_created : -1 }
    })
    .then((result) => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
};

exports.findFullPage = (req, res) => {
    var populateOptions = ({ path: 'killer victim match', select: '-ip' });
    DMKills.paginate({}, {
        page : req.params.page,
        sort : { date_created : -1 },
        populate : populateOptions
    })
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
};

exports.findMatch = async (req, res) => {
    try {
        var result = await DMKills.find({match : req.params.match}).exec();
        res.send(result)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.findPlayerKills = (req, res) => {
    if (req.params.page === undefined) {
        req.params.page = 1;
    }
    userId = {
        'platform' : req.params.platform,
        'profile' : req.params.profile
    }
    DMKills.paginate({ $or : [
        { 'killer' : userId },
        { 'victim' : userId }
    ]}, {
        page : req.params.page
    })
    .then(result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send(err);
    })
}


exports.findAll = (req, res) => {
    DMKills.find({
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

exports.getMostPlayed = (req, res) => {
    var plays = [];
    DMKills.aggregate([
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
    var x = await DMKills.find({killer : new ObjectId(req.params.id) , victim : new ObjectId(playerMU._id)}).countDocuments().exec()
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