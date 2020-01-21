var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregate = require('mongoose-aggregate-paginate-v2');

var Schema = mongoose.Schema;

const DMMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    profile : {
        type : {
            profile : String,
            platform : String,
        },
        ref: 'Player'
    },
});

const TDMMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    profile : {
        type : {
            profile : String,
            platform : String,
        },
        ref: 'Player'
    },
});
const CTFMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    profile : {
        type : {
            profile : String,
            platform : String,
        },
        ref: 'Player'
    },
});
const SVLMessageSchema = new Schema({
    message : String,
    name : String, 
    date_created : Date,
    profile : {
        type : {
            profile : String,
            platform : String,
        },
        ref: 'Player'
    },
});

DMMessageSchema.plugin(mongoosePaginate);
DMMessageSchema.plugin(mongooseAggregate);
TDMMessageSchema.plugin(mongoosePaginate);
TDMMessageSchema.plugin(mongooseAggregate);
CTFMessageSchema.plugin(mongoosePaginate);
CTFMessageSchema.plugin(mongooseAggregate);
SVLMessageSchema.plugin(mongooseAggregate)
SVLMessageSchema.plugin(mongoosePaginate);

module.exports.ctf = mongoose.model('ctf_messages', CTFMessageSchema);
module.exports.dm = mongoose.model('dm_messages', DMMessageSchema);
module.exports.tdm = mongoose.model('tdm_messages', TDMMessageSchema);
module.exports.svl = mongoose.model('svl_messages', SVLMessageSchema);