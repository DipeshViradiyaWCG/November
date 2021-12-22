
var CronJob = require('cron').CronJob;

var jobOfCronDemo2 = new CronJob(
    config.files.cronDemo2.time,
    function() {
        console.log("Console log from cronDemo2.js file...");
    },
    null,
    true,
    'Asia/Kolkata'
);

if(config.scheduler == "on" && config.files.cronDemo2.active == true){
    jobOfCronDemo2.start();
} else {
    jobOfCronDemo2.stop();
}