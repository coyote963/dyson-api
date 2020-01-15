var mongoose = require('mongoose');
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

module.exports = mongoose.model('dm_profiles', DMProfileSchema);