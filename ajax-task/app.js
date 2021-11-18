var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require("express-handlebars");

const moment = require("moment");
process.env.TZ = "UTC";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// DB Code
var mongoose = require('mongoose');
mongoose.connect(
  "mongodb://admin:admin@localhost:27017/ajax-pro").then(
    () => {console.log("Connected");}
  ).catch(
    (err) => {throw err;}
);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: false,
    helpers:{
      "convertUTCtoIST":(UTCtime) => moment(UTCtime).utcOffset("+05:30").format("YYYY-MM-DD LT"),
      "compare" : (a, b) => a == b ? true : false
    }
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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