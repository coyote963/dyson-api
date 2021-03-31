var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginateAggregate = require('mongoose-aggregate-paginate-v2')
var mongoosePaginate = require('mongoose-paginate-v2')


var DMProfileSchema = new Schema({
    player : {
        type: Schema.Types.ObjectId,
        ref : 'Player'
    },
    mu : Number,
    sigma : Number,
    kills : Number,
    deaths : Number,
    last_updated : Date,
}, { collection: 'dm_profiles' })
DMProfileSchema.plugin(mongoosePaginateAggregate)
DMProfileSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('dm_profiles', DMProfileSchema);