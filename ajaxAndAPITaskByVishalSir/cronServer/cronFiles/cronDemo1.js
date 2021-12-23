var CronJob = require('cron').CronJob;

module.exports = function (options) {
    new CronJob(
        options.time,
        function() {
            console.log("Console log from cronDemo1.js file...");
        },
        null,
        true,
        'Asia/Kolkata'
    ).start();
}