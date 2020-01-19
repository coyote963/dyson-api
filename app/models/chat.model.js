var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

const DMMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    match : { type: Schema.Types.ObjectId, ref: 'players' },
});

const TDMMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    match : { type: Schema.Types.ObjectId, ref: 'players' },
});
const CTFMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    match : { type: Schema.Types.ObjectId, ref: 'players' },
});
const SVLMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    match : { type: Schema.Types.ObjectId, ref: 'players' },
});

DMMessageSchema.plugin(mongoosePaginate);
TDMMessageSchema.plugin(mongoosePaginate);
CTFMessageSchema.plugin(mongoosePaginate);
SVLMessageSchema.plugin(mongoosePaginate);

module.exports.ctf = mongoose.model('ctf_messages', CTFMessageSchema);
module.exports.dm = mongoose.model('dm_messages', DMMessageSchema);
module.exports.tdm = mongoose.model('tdm_messages', TDMMessageSchema);
module.exports.svl = mongoose.model('svl_messages', SVLMessageSchema);