var CronJob = require('cron').CronJob;

// requiring db model
const userModel = require("./models/users");
const csvFileModel = require("./models/csvFiles");
const feildModel = require("./models/fields");

// Console log counter and string every 2 seconds
var job = new CronJob(
	'*/5 * * * * *',
	async function() {
		try {
            let csvFile = await csvFileModel.aggregate([
                {
                    $match : {
                        status : "pending"
                    }
                },{
                    $limit : 1
                }
            ]);
            console.log(csvFile);
        } catch (error) {
            console.log(error);
        }
	},
	null,
	true,
	'Asia/Kolkata'
);

job.start();