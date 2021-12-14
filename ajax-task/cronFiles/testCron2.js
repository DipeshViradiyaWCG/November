var CronJob = require('cron').CronJob;

let counter = 0;
// Console log counter and string every 2 seconds
var job = new CronJob(
	'*/5 * * * * *',
	async function() {
		try {
      console.log("This console logs every 5 seconds");
      console.log(counter);
      counter++;
    } catch (error) {
      console.log(error);
    }
	},
	null,
	true,
	'Asia/Kolkata'
);

job.start();