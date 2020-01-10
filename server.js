const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');

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

const port = process.env.PORT || 8080;
const router = express.Router();

require('./app/routes/player.routes.js') (app)

app.listen(port)
console.log('Server has started on port ' + port)
console.log('http://localhost:' + port + "/api/")