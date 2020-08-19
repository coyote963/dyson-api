const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
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
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})
app.use(express.static('public'))


const port = process.env.PORT || 8081;
const host = '0.0.0.0'


app.listen(port, host);

console.log(`Server is running on ${host}:${port}`)
console.log('http://localhost:' + port)