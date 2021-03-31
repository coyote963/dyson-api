var mongoose = require('mongoose');
const { Schema } = require("mongoose");

var CLBCompleteSchema = new Schema({
    map_name : String,
    map_path : String,
    date_created : Date,
    player : {
        type: Schema.Types.ObjectId,
        ref : 'Player'
    }
});

module.exports = mongoose.model('clb_completes', CLBCompleteSchema)
