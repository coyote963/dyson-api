var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;


var DMMatchSchema = new Schema({
    map_name: String,
    date_created : Date
});


var DMProfileSchema = new Schema({
    player : {
        type: Schema.Types.ObjectId,
        ref : 'Player'
    },
    mu : String,
    sigma : String,
    kills : String,
    deaths : String,
    last_updated : String
}, { collection: 'dm_profiles' })

var DMKillSchema = new Schema({
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
        mu : Number,
        sigma : Number,
        mu_delta : Number,
        sigma_delta : Number
    },
    victim_rating : {
        mu : Number,
        sigma : Number,
        mu_delta : Number,
        sigma_delta : Number
    },
    weapon : String,
    killer_location : String,
    victim_location : String,
    date_created : Date,
    match : { type: Schema.Types.ObjectId, ref: 'dm_matches' }
})


DMKillSchema.plugin(mongoosePaginate)
mongoose.model('dm_matches', DMMatchSchema)
module.exports = mongoose.model('dm_kills', DMKillSchema);