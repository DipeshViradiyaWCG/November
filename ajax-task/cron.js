var createError = require('http-errors');
const fs = require("fs");
const { promisify } = require("util");

let readFileAsync = promisify(fs.readFile);
let readDirAsync = promisify(fs.readdir);

// DB Code
var mongoose = require('mongoose');
mongoose.connect(
  "mongodb://admin:admin@localhost:27017/ajax-pro").then(
      () => {
        console.log("cron Connected");

        // Load and run every file in cronFiles folder 
        (async function loadCode() {
          try {
            let cronFiles = await readDirAsync("./cronFiles");
            for(const cronFile of cronFiles){
              eval(await readFileAsync("./cronFiles/" + cronFile, "utf-8"));
            }
          } catch (error) {
            console.log("Error in loading code files...", error);
          }
        })();
        
    }
  ).catch(
    (err) => {throw err;}
);