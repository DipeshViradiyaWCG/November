var CronJob = require('cron').CronJob;

let counter = 0;
// Console log counter and string every 2 seconds
var job = new CronJob(
	'*/2 * * * * *',
	async function() {
		try {
      console.log("This console logs every 2 seconds");
      console.log(counter);
      counter++;
      if(counter > 10){
        console.log("S");
        job.stop();
      }
    } catch (error) {
      console.log(error);
    }
	},
	null,
	true,
	'Asia/Kolkata'
);

job.start();