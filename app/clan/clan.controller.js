const clan = require('./clan.model')
const player = require('../models/player.model').player
const tdmplayer = require('../models/tdmprofile.model');
const clanComment = require('./clan-comment.model');
exports.getAllClans = (req, res) => {
    player.aggregate([
      {
        '$match': {
          'clan_tag': {
            '$ne': ''
          }
        }
      }, {
        '$group': {
          '_id': '$clan_id', 
          'clan_tag': {
            '$first': '$clan_tag'
          }, 
          'total': {
            '$sum': 1
          }, 
          'players': {
            '$push': '$$ROOT'
          }
        }
      }
    ]).then(result => res.send(result))
}

exports.getDescription = (req, res) => {
    
    clan.findOne({ 'clan_id' : req.params.clanId })
    .then(docs => {
        res.send(docs)
    })
}

exports.getLeaderboard = (req, res) => {
  tdmplayer.aggregate([
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
        'elo': 1, 
        'first': {
          '$arrayElemAt': [
            '$newplayer', 0
          ]
        }
      }
    }, {
      '$match': {
        'first.clan_tag': {
          '$ne': ''
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'elo': 1, 
        'clan_tag': 1, 
        'clan_id': 1, 
        'clan_id': '$first.clan_id', 
        'clan_tag': '$first.clan_tag', 
        'name': {
          '$arrayElemAt': [
            '$first.name', 0
          ]
        }, 
        'pid': '$first._id'
      }
    }, {
      '$sort': {
        'elo': -1
      }
    }
  ]).then(docs => {
    res.send(docs)
  })
}

exports.getAllComments = (req, res) => {
  clanComment.find({}).then(docs => { res.send(docs)})
}

exports.getClanComments = (req, res) => {
  clanComment.find({
    clan_id : req.params.clanId
  }).then(docs => { res.send(docs)})
}

exports.addClanComment = (req, res) => {
  console.log(req.body)
  const comment = new clanComment({
    sender_id : req.body.sender_id,
    date: Date(),
    message : req.body.message,
    username : req.body.username,
    clan_id : req.body.clan_id
  });

  // Save Tutorial in the database
  comment
    .save(comment)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Comment."
      });
    });
}