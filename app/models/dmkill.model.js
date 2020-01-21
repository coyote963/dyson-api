var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;


var DMMatchSchema = new Schema({
    map_name: String,
    date_created : Date
});

var DMKillSchema = new Schema({
    killer : {
        type : { 
            profile : String,
            platform : String
        },
        ref : 'Player'
    },
    victim : {
        type : { 
            profile : String,
            platform : String
        },
        ref : 'Player'
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