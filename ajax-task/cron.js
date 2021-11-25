var createError = require('http-errors');
// var express = require('express');
// var app = express();
const fs = require("fs");
const { promisify } = require("util");

let readFileAsync = promisify(fs.readFile);

// DB Code
var mongoose = require('mongoose');
mongoose.connect(
  "mongodb://admin:admin@localhost:27017/ajax-pro").then(
      () => {
        console.log("cron Connected");
        (async function loadCode() {
          eval(await readFileAsync("./cronFiles/emailSchedule.js", "utf-8"));
        })();
    }
  ).catch(
    (err) => {throw err;}
);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });