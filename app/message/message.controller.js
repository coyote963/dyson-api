const messageTypes = require('./message.model.js')
const {ObjectId} = require('mongodb');

exports.getMessage = (req, res) => {
    res.send(req.user)

}


exports.fetchMessages = (req, res) => {
    messageTypes.GlobalMessage.find({}, function (err, docs) {
        res.send(docs)
    });
}

exports.fetchPrivateChat = (req, res) => {
    const sender = req.params.sender;
    const recipient = req.params.recipient;
    messageTypes.PrivateMessage.find({
        $or: [
          {
            $and : [
              {
                from: ObjectId(sender)
              }, {
                to: ObjectId(recipient)
              }
            ]
          }, {
            $and : [
              {
                from: ObjectId(recipient)
              }, {
                to: ObjectId(sender)
              }
            ]
          },
        ]
    }).then(globalmessages => {
        res.send(globalmessages)
    })
}