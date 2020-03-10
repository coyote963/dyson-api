var mongoose = require('mongoose');
var mongoosePagination = require('mongoose-paginate-v2')
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    _id : { 
        profile : String,
        platform : String
    },
    color : String,
    premium : String,
    ip : [String],
    name : [String],
    hat : String
})

var TDMRatingInstanceSchema = new Schema({
    player : {
        type : {
            platform : String,
            profile : String
        },
        ref : 'Player'
    },
    tdm_round : { type : Schema.Types.ObjectId, ref : "tdm_rounds"},
    mu : Number,
    sigma : Number,
    mu_delta : Number,
    sigma_delta : Number
})



var TDMRoundSchema = new Schema({
    map_name : String,
    man_players : [{
        type : {
            profile : String,
            platform :String
        },
        ref : 'Player'
    }],
    usc_players : [{
        type : {
            profile : String,
            platform :String
        },
        ref : 'Player'
    }],
    result : String,
    created : Date
})

TDMRatingInstanceSchema.plugin(mongoosePagination);
TDMRoundSchema.plugin(mongoosePagination);

module.exports.tdm_instance = mongoose.model('tdm_rating_instances', TDMRatingInstanceSchema);
module.exports.tdm_rounds = mongoose.model('tdm_rounds', TDMRoundSchema);
module.exports.player_schema = PlayerSchema;
