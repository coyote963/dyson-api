const CTFInstance = require('../models/ctfinstance.model.js');

exports.findAll = (req, res) => {
    CTFInstance.paginate({}, {
        page : req.params.page
    })
    .then(result => {
        res.send(result)
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
        var result = await CTFInstance.find(userId).exec();
        res.send(result)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.findMatch = async (req, res) => {
    try {
        var result = await CTFInstance.find({match : req.params.match}).exec();
        res.send(result)
    } catch (err) {
        res.status(500).send(err)
    }
}
