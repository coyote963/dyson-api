const TDMInstance = require('../models/tdmprofile.model');

exports.findAll = (req, res) => {
    TDMInstance.paginate({}, {
        page : req.params.page
    })
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}

exports.findAllFull = (req, res) => {
    TDMInstance.find()
    .populate("player")
    .limit(10)
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}
