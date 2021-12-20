var createError = require('http-errors');
const fs = require("fs");
const { promisify } = require("util");
global.config = require("./config");

let readFileAsync = promisify(fs.readFile);
// let readDirAsync = promisify(fs.readdir);

// DB Code
var mongoose = require('mongoose');
mongoose.connect(`mongodb://${config.mongodb.databaseUsername}:${config.mongodb.databasePassword}@${config.mongodb.databaseHost}:${config.mongodb.databasePort}/${config.mongodb.databaseName}`).then(
      () => {
        console.log("cron Connected");

        // Load and run every file in cronFiles folder 
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