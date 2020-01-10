const DMProfile = require('../models/dmprofile.model.js');


exports.findAll = (req, res) => {
    DMProfile.find({}, function (err, users) {
        res.send(users)
    })
}

exports.findOne = (req, res) => {
    DMProfile.find({ player : { platform : req.params.platform, profile : req.params.profile }},
        function (err, player) {
            res.send(player)
        }
    )
}
