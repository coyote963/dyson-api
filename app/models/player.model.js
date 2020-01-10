var mongoose = require('mongoose');
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

module.exports = mongoose.model('Player', PlayerSchema);