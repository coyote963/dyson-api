var mongoose = require('mongoose');
var mongoosePaginateAggregate = require('mongoose-aggregate-paginate-v2')
var mongoosePaginate = require('mongoose-paginate-v2')
var Schema = mongoose.Schema;


var DMProfileSchema = new Schema({
    player : {
        type : { 
            profile : String,
            platform : String
        },
        ref : 'Player'
    },
    mu : String,
    sigma : String,
    kills : String,
    deaths : String,
    last_updated : String
}, { collection: 'dm_profiles' })
DMProfileSchema.plugin(mongoosePaginateAggregate)
DMProfileSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('dm_profiles', DMProfileSchema);