var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

global.config = require("./config.json");
// const fs = require("fs");
// const { promisify } = require("util");  
// let readFileAsync = promisify(fs.readFile);

var CronJob = require('cron').CronJob;
// DB Code
var mongoose = require('mongoose');
mongoose.connect(
  `mongodb://admin:admin@localhost:27017/ajax-api-pro`).then(
    () => {console.log("Connected");

      (async function runCronCode(){
        try {
            if(config.scheduler == "on"){
              for(let keyOfFilesObj of Object.keys(config.files)){
                if(config.files[keyOfFilesObj].active){
                  require("./cronFiles/" + config.files[keyOfFilesObj].name)({time : config.files[keyOfFilesObj].time});                  
                }
              }
            }
        } catch (error) {
            console.log("Err in cron scheduling" + error);
        }
      })();

    }
  ).catch(
    (err) => {throw err;}
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const redis = require("redis");

(async () => {
  try {
      var client = redis.createClient({
          url: 'redis://localhost:6379/0'
      })
      client.on('error', (err) => console.log('Redis Client Error', err));
      await client.connect();
      client.subscribe("demoPublish", (msg, chnl) => {
        console.log(msg);
        console.log(chnl);
      })
      console.log("connected!..");
  } catch (error) {
      console.log("error", error);
  }
})();

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
