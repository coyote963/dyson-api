const loadout = require('./loadouts.models').loadout
const {ObjectId} = require('mongodb');
exports.findLoadouts = (req, res) => {

	loadout.aggregate([
            {
              '$match': {
                'tdm_player': ObjectId(req.params.id)
              }
            }, {
              '$addFields': {
                'weapons': {
                  '$cond': {
                    'if': {
                      '$gte': [
                        '$weap1', '$weap2'
                      ]
                    }, 
                    'then': [
                      '$weap1', '$weap2'
                    ], 
                    'else': [
                      '$weap2', '$weap1'
                    ]
                  }
                }
              }
            }, {
              '$group': {
                '_id': {
                  'weapons': '$weapons', 
                  'equip': '$equip'
                }, 
                'count': {
                  '$sum': 1
                }
              }
            }, {
              '$sort': {
                'count': -1
              }
            }
        ])
		.then(function (docs) {
			res.send(docs)
		})

}