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
const ctfinstanceRouter = require('./app/routes/ctfinstance.routes.js')


console.log(dbConfig.uri)
mongoose.connect(dbConfig.uri, {
    dbName: 'bmdb',
    useUnifiedTopology: true,
    useNewUrlParser: true
})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use('/players', playerRouter);
app.use('/dmprofiles', dmprofileRouter);
app.use('/dmkills', dmkillsRouter);
app.use('/ctfprofiles', ctfprofileRouter);
app.use('/ctfinstances', ctfinstanceRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})
app.use(express.static('public'))


const port = process.env.PORT || 8080;

app.listen(port)

console.log('Server has started on port ' + port)
console.log('http://localhost:' + port + "/api/")