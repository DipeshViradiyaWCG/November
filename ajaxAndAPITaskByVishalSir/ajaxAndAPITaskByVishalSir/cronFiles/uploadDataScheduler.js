var CronJob = require('cron').CronJob;

const csv = require("csvtojson");

const { validateCsvData } = require("./utilities/validateCsvData");
// process.env.uploadDataSchedulerCron = false;


// requiring db model
const userModel = require("./models/users");
const csvFileModel = require("./models/csvFiles");


var job = new CronJob(
	'*/5 * * * * *',
	async function() {
		try {
            if(!(global.uploadDataSchedulerCronFlag)){
                global.uploadDataSchedulerCronFlag = true;
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
                if(csvFile.length > 0) {
                    if(csvFile[0].mapObject){
                        await csvFileModel.updateOne({ _id : csvFile[0]._id} , {
                            status : "in progress"
                        })

                        console.log("delay for 3 sec");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        console.log("delay ended");
                        
                        let result;
                        if(csvFile.hasHeaders){
                            result = await csv().fromFile(csvFile[0].path);
                        } else {
                            result = await csv( { noheader : true } ).fromFile(csvFile[0].path);
                            let firstDemoEntryObj = result[0];
                            let firstDemoEntryObjKeys = Object.keys(firstDemoEntryObj);
                            for(let key in csvFile[0].mapObject) {
                                csvFile[0].mapObject[key] = firstDemoEntryObjKeys.find((key1) => firstDemoEntryObj[key1] == csvFile[0].mapObject[key]);
                            }
                            console.log(csvFile[0].mapObject);
                        }
                        let validatedUsersData = await validateCsvData(result, csvFile[0].mapObject, csvFile[0]._id);
                        if(validatedUsersData.validUserData.length > 0){
                            await userModel.insertMany(validatedUsersData.validUserData);
                        }
                        await csvFileModel.updateOne({ _id : csvFile[0]._id} , {
                            totalRecords : result.length,
                            duplicates : validatedUsersData.duplicateEntryCount,
                            discarded : validatedUsersData.duplicateEntryInCsvCount,
                            totalUploaded : validatedUsersData.validUserData.length,
                            status : "uploaded"
                        })
                    }
                } 
                global.uploadDataSchedulerCronFlag = false;
            }
        } catch (error) {
            console.log(error);
            global.uploadDataSchedulerCronFlag = false;
        }
	},
	null,
	true,
	'Asia/Kolkata'
);

job.start();