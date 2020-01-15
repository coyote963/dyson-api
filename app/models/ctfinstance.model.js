var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;



const CTFMatchSchema = new Schema({
    map_name : String,
    date_created : Date
})

const CTFInstanceSchema = new Schema({
    player : {
        type : {
            profile : String,
            platform : String
        },
        ref : 'Player'
    },
    match : { type: Schema.Types.ObjectId, ref: 'ctf_matches' },
    mu : Number,
    sigma : Number,
    mu_delta : Number,
    sigma_delta : Number,
})
CTFInstanceSchema.plugin(mongoosePaginate);
mongoose.model('ctf_matches', CTFMatchSchema);
module.exports = mongoose.model('ctf_rating_instances', CTFInstanceSchema);