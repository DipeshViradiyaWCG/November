var createError = require('http-errors');
const fs = require("fs");
const { promisify } = require("util");
var express = require('express');
var app = express();

const http = require("http").createServer(app);
let io = require("socket.io")(http);

var cors = require('cors')
app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected');
});

global.config = require("./config");

let readFileAsync = promisify(fs.readFile);

global.uploadDataSchedulerCron = false;

// DB Code
var mongoose = require('mongoose');
mongoose.connect(`mongodb://${config.mongodb.databaseUsername}:${config.mongodb.databasePassword}@${config.mongodb.databaseHost}:${config.mongodb.databasePort}/${config.mongodb.databaseName}`).then(
      () => {
        console.log("cron Connected");
        (async function loadCode() {
            try {
                eval(await readFileAsync("./cronFiles/uploadDataScheduler.js", "utf-8"));
            } catch (error) {
                console.log("Error in loading code files...", error);
            }
        })();
    }
).catch(
    (err) => {throw err;}
);

app.listen(3001, () => {
    console.log("cron is running on 3001");
});