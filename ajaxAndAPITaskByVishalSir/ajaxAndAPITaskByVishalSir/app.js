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

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// var cors = require('cors')

// app.use(cors());

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
//   next();
// });


// app.use(cors({
//   origin: 'http://localhost:3000/users',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }));

// io.on('connection', (socket) => {
//     console.log('a user connected');
// });

const redis = require("redis");

(async () => {
  try {
      var client = redis.createClient({
          url: 'redis://localhost:6379/0'
      })
      client.on('error', (err) => console.log('Redis Client Error', err));
      await client.connect();
      console.log("connected!..");
      console.log("publishing");
      await client.publish("demoPublish", "Hello this is publish data from port 3000");
  } catch (error) {
      console.log("error", error);
  }
})();


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

app.listen(3000, function(){
  console.log("server start");
})

// module.exports = app;
