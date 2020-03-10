var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
var Schema = mongoose.Schema;


var TDMProfileSchema = new Schema({
    player : {
        type: Schema.Types.ObjectId,
        ref : 'Player'
    },
    mu : String,
    sigma : String,
    elo : String,
    kills : String,
    deaths : String,
    wins : String,
    losses : String,
    last_updated : String
}, { collection: 'tdm_profiles' })

TDMProfileSchema.plugin(mongooseAggregatePaginate)

TDMProfileSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('tdm_profiles', TDMProfileSchema)
