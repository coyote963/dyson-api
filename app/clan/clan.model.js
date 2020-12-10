var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ClanSchema = new Schema({
    group_name : String,
    avatar : String, 
    group_url : String,
    summary : String,
    headline : String,
    group_id : Number,
    clan_id : Number
});

module.exports = mongoose.model('clan_descriptions', ClanSchema)
