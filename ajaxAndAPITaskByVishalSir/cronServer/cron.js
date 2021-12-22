global.config = require("./config.json");

const fs = require("fs");
const { promisify } = require("util");

let readFileAsync = promisify(fs.readFile);

let filesArray = [];

for(let keyOfFilesObj of Object.keys(config.files)){
    filesArray.push( config.files[keyOfFilesObj].name );
}

(async function runCronCode(){
    try {
        for(let fileName of filesArray) {
            eval(await readFileAsync("./cronFiles/" + fileName, "utf-8"));
        }
    } catch (error) {
        console.log("Err in cron scheduling" + error);
    }
})();