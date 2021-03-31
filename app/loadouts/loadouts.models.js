var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const LoadoutSchema = new mongoose.Schema({
    tdm_player : Schema.Types.ObjectId,
    tdm_round : Schema.Types.ObjectId,
    weap1: String,
    weap2: String,
    dual: String,
    offweap: String,
    offweap2: String
});
module.exports.loadout = mongoose.model('tdm_loadouts', LoadoutSchema);
