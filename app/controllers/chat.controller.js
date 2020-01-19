const chats = require('../models/chat.model.js');

function getMode (mode) {
    if (mode === 'tdm') {
        return chats.tdm
    } else if (mode === 'dm') {
        return chats.dm
    } else if (mode === 'ctf') {
        return chats.ctf
    } else if (mode === 'svl') {
        return chats.svl
    } else {
        throw "This is not a gamemode";
    }
    
}

exports.findAll = (req, res) => {
    x = getMode(req.params.mode)
    x.paginate({}, { page : req.params.page })
    .then(chats => {
        res.send(chats)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}

exports.findUser = (req, res) => {
    x = getMode(req.params.mode)
    x.paginate({ 'profile.profile' : req.params.profile,
        'profile.platform' : req.params.platform
    }, {page : req.params.page})
    .then(chats => {
        res.send(chats)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}


exports.findContext = (req, res) => {
    x = getMode(req.params.mode);
    x.findById(req.params.chatId)
    .then(message => {
        x.find({_id : { $lte : req.params.chatId}})
        .sort({ _id : -1})
        .limit(10)
        .then(earlier => {
            x.find({_id : { $gt : req.params.chatId}})
            .limit(10)
            .then(later => {
                res.send({docs : earlier.reverse().concat(later)})
            })
            .catch(err => {
                res.status(500).send(err)
            })
        })
        .catch(err => {
            res.status(500).send(err)
        })
    })
    .catch(err => {
        res.status(500).send(err)
    })
}

exports.findKeyword = (req, res) => {
    x = getMode(req.params.mode);
    x.find({ $text : { $search : req.params.searchterm}},
    {score : { $meta : "textScore"} })
    .sort( { score: { $meta: "textScore" } } )
    .then(results => {
        res.send(results)
    })
    .catch(err => {
        res.status(500).send(err)
    })
}