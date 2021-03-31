var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
var Schema = mongoose.Schema;


var TDMRound = new Schema({
    map_name : String,
    man_players : [Schema.Types.ObjectId],
    usc_players : [Schema.Types.ObjectId],
    man_players_profiles : [Schema.Types.ObjectId],
    man_players_profiles : [Schema.Types.ObjectId],
    result : String,
    date_created: Date
}, { collection: 'tdm_rounds' })

module.exports = mongoose.model('tdm_rounds', TDMRound)
