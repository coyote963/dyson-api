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