var CronJob = require('cron').CronJob;
const emailScheduleModel = require("./models/emailSchedule");
const { sendMailService } = require('./services/sendMailService');


// Entertain one mail request at every minute 
var job = new CronJob(
	'* * * * *',
	async function() {
		try {
      let emailsToSend = await emailScheduleModel.find({status : 0}).lean();
      if(emailsToSend.length > 0){
        sendMailService(emailsToSend[0].receiverEmail, emailsToSend[0].receiverEmailText);  
        await emailScheduleModel.updateOne({status : 0}, {status : 1});
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