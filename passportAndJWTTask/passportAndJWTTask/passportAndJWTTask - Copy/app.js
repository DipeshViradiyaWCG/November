var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const exphbs = require("express-handlebars");

const session = require("express-session");
const passport = require('passport');
const MongoStore  = require('connect-mongo');

const mongoose = require("mongoose");

mongoose
.connect("mongodb://admin:admin@localhost:27017/passport-project")
  .then(function () {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
});

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: false,
  })
);
app.set("view engine", "hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "secret",
    store: new MongoStore({
      mongoUrl: "mongodb://admin:admin@localhost:27017/passport-project",
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 60 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', apiRouter);

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
