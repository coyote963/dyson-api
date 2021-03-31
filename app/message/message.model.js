var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const globalMessageSchema = new mongoose.Schema({
    sender_id : Schema.Types.ObjectId,
    date: Date,
    message : String,
    username : String
});
exports.GlobalMessage = mongoose.model('global_messages', globalMessageSchema);


const privateMessageSchema = new mongoose.Schema({
    from :Schema.Types.ObjectId,
    from_name : String,
    to: Schema.Types.ObjectId,
    to_name: String,
    date: Date,
    message : String,
});
exports.PrivateMessage = mongoose.model('private_messages', privateMessageSchema);

