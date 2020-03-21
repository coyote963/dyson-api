var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var TDMProfileSchema = require('./tdmprofile.model')
var Schema = mongoose.Schema;


var TDMMatchSchema = new Schema({
    map_name: String,
    date_created : Date
});

var TDMKillSchema = new Schema({
    killer : {
        type: Schema.Types.ObjectId,
        ref: 'players'
    },
    killer_profile : {
        type: Schema.Types.ObjectId,
        ref: 'dm_profiles'
    },
    victim : {
        type: Schema.Types.ObjectId,
        ref: 'players'
    },
    victim_profile : {
        type: Schema.Types.ObjectId,
        ref: 'dm_profiles'
    },
    killer_rating : {
        elo : Number,
        delta : Number
    },
    victim_rating : {
        elo : Number,
        delta : Number
    },
    weapon : String,
    killer_location : String,
    victim_location : String,
    date_created : Date,
    match : { type: Schema.Types.ObjectId, ref: 'tdm_matches' }
})


TDMKillSchema.plugin(mongoosePaginate)
mongoose.model('tdm_matches', TDMMatchSchema)
module.exports = mongoose.model('tdm_kills', TDMKillSchema);