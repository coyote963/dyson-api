var mongoose = require('mongoose');
var mongoosePagination = require('mongoose-paginate-v2')
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
PlayerSchema.plugin(mongoosePagination)
module.exports = mongoose.model('Player', PlayerSchema);