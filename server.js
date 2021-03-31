const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
passport = require('passport');
SteamStrategy = require('passport-steam').Strategy
var path = require('path');
// Import the various routers
const playerRouter = require('./app/routes/player.routes.js');
const dmprofileRouter = require('./app/routes/dmprofile.routes.js');
const dmkillsRouter = require('./app/routes/dmkills.routes');
const ctfprofileRouter = require('./app/routes/ctfprofile.routes.js');
const ctfinstanceRouter = require('./app/routes/ctfinstance.routes.js');
const chatRouter = require('./app/routes/chat.routes.js');
const tdminstanceRouter = require('./app/routes/tdminstance.routes');
const tdmprofileRouter = require('./app/routes/tdmprofiles.router')
const messageRouter = require('./app/message/message.router')
const clanRouter = require('./app/clan/clan.routes')
const authRouter = require('./app/routes/auth.routes')
const configureBConnect = require('./configurebconnect');
const loadoutRouter = require('./app/loadouts/loadouts.routes');
var expressJwt = require('express-jwt');
var messageModel = require('./app/message/message.model');
var Player = require('./app/models/player.model').player
var jwt = require('jsonwebtoken')




var auth_middleware = expressJwt({ secret: dbConfig.secretkey, algorithms: ['HS256']})
console.log(dbConfig.backendUri + 'auth/steam/return')
passport.use(new SteamStrategy({
    returnURL: dbConfig.backendUri + 'auth/steam/return',
    realm: dbConfig.backendUri,
    apiKey: dbConfig.steamkey
  },
  function(identifier, profile, done) {
    console.log("Hlelo")
    profile.identifier = identifier;
    Player.findOne({
      "profile.platform" : "0",
      "profile.profile" : profile._json.steamid
    })
    .then((user, err) => {
      (user)
      return done(null, user)
    })
  }
  ));
  app.use(passport.initialize());

app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
});

app.get('/auth/steam/return',
  passport.authenticate('steam', { session: false}),
  function(req, res) {
    const token = jwt.sign({ user: req.user }, dbConfig.secretkey, {
      expiresIn: "2h",
    });
    res.render("authenticated", {
      jwtToken: token,
      clientUrl: dbConfig.frontendUri ,
    });
  }
);

mongoose.connect(dbConfig.uri, {
    dbName: 'bmdb',
    useUnifiedTopology: true,
    useNewUrlParser: true
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use('/players', playerRouter);
app.use('/dmprofiles', dmprofileRouter);
app.use('/dmkills', dmkillsRouter);
app.use('/ctfprofiles', ctfprofileRouter);
app.use('/ctfinstances', ctfinstanceRouter);
app.use('/chat', chatRouter);
app.use('/tdminstances', tdminstanceRouter);
app.use('/tdmprofiles', tdmprofileRouter);
app.use('/messages', messageRouter)
app.use('/clans', clanRouter)
app.use('/auth', authRouter)
app.set("view engine", "ejs");
app.use('/loadouts', loadoutRouter);
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

// app.get("/auth", (req, res) => {
//   res.sendFile(path.join(__dirname + '/auth.html'))
// })

app.use(express.static('public'))



const port = process.env.PORT || 8081;
const host = '0.0.0.0'


connectedSockets = {}
var server = app.listen(port, host);
const io = require("socket.io")(server)
io.on("connection", socket => {
  socket.on('JOIN_ROOM', function(room) {
    socket.join(room)
  });

  socket.on('LEAVE_ROOM', room => {
    socket.leave(room)
  })
  socket.on('MESSAGE', function (data) {
    const newMessage = new messageModel.GlobalMessage(data)
    newMessage.save(function (err) {
      if (err) return handleError(err);
    });
    io.emit('MESSAGE', data)
  })
  socket.on('DISCONNECT', () => {
    io.emit('DISCONNECT')
  })
  socket.on('JOIN', (data) => {
    io.emit('RECEIVE_MESSAGE', data)
  })
  socket.on('REGISTER', (data) => {
    connectedSockets[data._id] = socket
  })
  socket.on('PRIVATE_MESSAGE', (data) => {
    const to = data.to;
    const newMessage = new messageModel.PrivateMessage(data)
    newMessage.save(function (err) {
      if (err) return handleError(err);
    });
    if (connectedSockets.hasOwnProperty(to)) {
      connectedSockets[to].emit('PRIVATE_MESSAGE', data)
    }
    socket.emit("PRIVATE_MESSAGE", data)
  })

})



// configureBConnect(io);

console.log(`Server is running on ${host}:${port}`)
console.log('http://localhost:' + port)