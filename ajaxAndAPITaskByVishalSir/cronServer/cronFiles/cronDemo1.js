
var CronJob = require('cron').CronJob;

var jobOfCronDemo1 = new CronJob(
    config.files.cronDemo1.time,
    function() {
        console.log("Console log from cronDemo1.js file...");
    },
    null,
    true,
    'Asia/Kolkata'
);

if(config.scheduler == "on" && config.files.cronDemo1.active == true){
    jobOfCronDemo1.start();
} else {
    jobOfCronDemo1.stop();
}