var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    cookieParser = require('cookie-parser'),
    cons = require('consolidate');

var routes = require('./routes');
var dataRoutes = require('./routes/data.js');

var cron = require('./cron');

var port = process.env.PORT || 3000;

var app = express();

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", routes);
app.use("/data", dataRoutes);

if(!module.parent) {
    app.listen(port);
    console.log("Server started on port " + port);
}