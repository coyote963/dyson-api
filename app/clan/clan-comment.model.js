var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ClanCommentSchema = new Schema({
    sender_id : Schema.Types.ObjectId,
    date: Date,
    message : String,
    username : String,
    clan_id: Number
});

module.exports = mongoose.model('clan_comments', ClanCommentSchema)
