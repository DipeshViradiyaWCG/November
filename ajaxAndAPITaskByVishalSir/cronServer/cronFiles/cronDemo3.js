var CronJob = require('cron').CronJob;

module.exports = function (options) {
    new CronJob(
        options.time,
        function() {
            console.log("demo=demo=demo=demo=demo");
        },
        null,
        true,
        'Asia/Kolkata'
    ).start();
}