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
          }
        ]
    }).then(globalmessages => {
        res.send(globalmessages)
    })
}

exports.fetchDifferentUsers = async (req, res) => {
    const senderId = req.params.sender;

    var sentFrom = messageTypes.PrivateMessage.aggregate([
        {
          '$match': {
            'from': new ObjectId(senderId)
          }
        }, {
          '$sort': {
            'date': -1
          }
        }, {
          '$group': {
            '_id': '$to', 
            'date': {
              '$first': '$date'
            }, 
            'message': {
              '$first': '$message'
            }, 
            'user_name': {
              '$first': '$to_name'
            }, 
            'user': {
              '$first': '$to'
            }
          }
        }
    ]).then(sentFrom => {
        messageTypes.PrivateMessage.aggregate([
            {
              '$match': {
                'to': new ObjectId('5e374d2696058a68afa4f7d0')
              }
            }, {
              '$sort': {
                'date': -1
              }
            }, {
              '$group': {
                '_id': '$from', 
                'date': {
                  '$first': '$date'
                }, 
                'message': {
                  '$first': '$message'
                }, 
                'user_name': {
                  '$first': '$from_name'
                }, 
                'user': {
                  '$first': '$from'
                }
              }
            }
          ]).then(sentTo => {
                var inbox = [...sentFrom]
                sentTo.forEach(value => {
                    
                    const isSameUser = (doc) => { 
                        return doc.user_name === value.user_name 
                    }
                    const index = inbox.findIndex(isSameUser)
                    if (index === -1) {
                        inbox.push(value)
                    }
                    else if (inbox[index].date < value.date) {
                        inbox[index] = value
                    }
                })
                res.send(inbox)
          })
    })
}
