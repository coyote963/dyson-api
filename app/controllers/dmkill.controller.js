const DMKills = require('../models/dmkill.model.js');


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
    DMKills.paginate({}, {
        page : req.params.page,
        sort : { date_created : -1 },
        populate : 'killer victim match'
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