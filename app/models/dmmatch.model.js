var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DMMatchSchema = new Schema({
    map_name: String,
    date_created : Date
});

module.exports = mongoose.model('dm_matches', DMMatchSchema);