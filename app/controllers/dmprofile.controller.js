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