var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const moment = require("moment");

const hbs = require("express-handlebars");


// Requiring the global config
global.config = require("./config");

global.authAPI = require("./middlewares/authAPI");
global.isLogin = require("./middlewares/isLogin");

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// DB Code
var mongoose = require('mongoose');
mongoose.connect(
  `mongodb://${config.mongodb.databaseUsername}:${config.mongodb.databasePassword}@${config.mongodb.databaseHost}:${config.mongodb.databasePort}/${config.mongodb.databaseName}`).then(
    () => {console.log("Connected");}
  ).catch(
    (err) => {throw err;}
);

var app = express();

// A Helper function to render map choice table
const renderMapTable = require("./utilities/hbsHelper");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: false,
    helpers : {
      "renderTable" : renderMapTable.renderMapTable,
      "formatTime":(time) => moment(time).format("YYYY-MM-DD LT"),
    }
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const http = require("http").createServer(app);
// let io = require("socket.io")(http);

// var cors = require('cors')
// app.use(cors({
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }));

// io.on('connection', (socket) => {
//     console.log('a user connected');
// });

app.use('/', indexRouter);
app.use('/api', apiRouter);

// create a by default admin
require("./services/createAdmin");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
