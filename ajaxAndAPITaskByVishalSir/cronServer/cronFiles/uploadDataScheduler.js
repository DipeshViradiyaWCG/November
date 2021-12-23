var CronJob = require('cron').CronJob;

const csv = require("csvtojson");

const { validateCsvData } = require("../utilities/validateCsvData");

// requiring db model
const userModel = require("../models/users");
const csvFileModel = require("../models/csvFiles");

let startFlag = true;

module.exports = function (options) {
    new CronJob(
        options.time,
        async function() {
            try {
                if(startFlag){
                    socket.emit("fileProcessStarted");
                }
                startFlag = false;
                
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
                    socket.emit("demo");
                    if(csvFile.length > 0) {
    
    
                        if(csvFile[0].mapObject){
                            socket.emit("fileInProgress", csvFile[0]._id, csvFile[0].name);
                            await csvFileModel.updateOne({ _id : csvFile[0]._id} , {
                                status : "in progress"
                            })
    
                            console.log("delay for 3 sec");
                            await new Promise(resolve => setTimeout(resolve, 3000));
                            console.log("delay ended");
                            
                            let result;
                            if(csvFile.hasHeaders){
                                result = await csv().fromFile("/home/webcodegenie/Documents/WCG dipesh/Training 2021 codes/November/November/ajaxAndAPITaskByVishalSir/ajaxAndAPITaskByVishalSir/" + csvFile[0].path);
                            } else {
                                // Change mapObject if csv file has no header
                                result = await csv( { noheader : true } ).fromFile("/home/webcodegenie/Documents/WCG dipesh/Training 2021 codes/November/November/ajaxAndAPITaskByVishalSir/ajaxAndAPITaskByVishalSir/" + csvFile[0].path);
                                let firstDemoEntryObj = result[0];
                                let firstDemoEntryObjKeys = Object.keys(firstDemoEntryObj);
                                for(let key in csvFile[0].mapObject) {
                                    csvFile[0].mapObject[key] = firstDemoEntryObjKeys.find((key1) => firstDemoEntryObj[key1] == csvFile[0].mapObject[key]);
                                }
                                console.log(csvFile[0].mapObject);
                            }
    
                            let validatedUsersData = await validateCsvData(result, csvFile[0].mapObject, csvFile[0]._id);
                            if(validatedUsersData.validUserData.length > 0){
                                for(let iterator = 0; iterator < validatedUsersData.validUserData.length; iterator++) {
                                    await userModel.create(validatedUsersData.validUserData[iterator]);
                                    await csvFileModel.updateOne({_id : csvFile[0]._id}, { $inc : { parsedRows : 1 } });
                                    socket.emit("fileProgressPersentage", (iterator / validatedUsersData.validUserData.length)*100, csvFile[0]._id);   
                                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                                }
                                // await userModel.insertMany(validatedUsersData.validUserData);
                            }
                            await csvFileModel.updateOne({ _id : csvFile[0]._id} , {
                                totalRecords : result.length,
                                duplicates : validatedUsersData.duplicateEntryCount,
                                discarded : validatedUsersData.duplicateEntryInCsvCount,
                                totalUploaded : validatedUsersData.validUserData.length,
                                status : "uploaded"
                            })
                            socket.emit("fileUploaded", csvFile[0]._id, csvFile[0].name);
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
    ).start();
}