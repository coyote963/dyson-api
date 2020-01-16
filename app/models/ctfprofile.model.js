var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
var Schema = mongoose.Schema;

var CTFMatchSchema = new Schema({
    map_name: String,
    date_created : Date
});

const CTFProfileSchema = new Schema({
    player : {
        type : {
            profile : String,
            platform : String
        },
        ref : 'Player'
    },
    mu : Number,
    sigma : Number,
    kills : Number,
    deaths : Number,
    wins : Number,
    losses : Number,
    captures : Number,
    games : Number,
    last_updated : Date
});
CTFProfileSchema.plugin(mongooseAggregatePaginate)

CTFProfileSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('ctf_profiles', CTFProfileSchema)
