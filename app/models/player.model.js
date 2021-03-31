var mongoose = require('mongoose');
var mongoosePagination = require('mongoose-paginate-v2')
var Schema = mongoose.Schema;


var PlayerSchema = new Schema({
    player : { 
        profile : String,
        platform : String
    },
    color : String,
    premium : String,
    ip : [String],
    name : [String],
    hat : String
})

var SvlKillSchema = new Schema({
    killer : {
        type: Schema.Types.ObjectId,
        ref: 'dm_profiles'
    },
    enemy_rank: String,
    enemy_type: String,
    date_created: Date,
    current_round: {
        type: Schema.Types.ObjectId,
        ref: "svl_rounds",
    },
    weapon: String
})
PlayerSchema.plugin(mongoosePagination)
module.exports.player = mongoose.model('Player', PlayerSchema);
module.exports.svlkill = mongoose.model('svl_kills', SvlKillSchema);