global.config = require("./config.json");

// const nodemailer = require("nodemailer");

const fs = require("fs");
const { promisify } = require("util");

let readFileAsync = promisify(fs.readFile);


(async function runCronCode(){
    try {
        let filesArray = [];
        
        for(let keyOfFilesObj of Object.keys(config.files)){
            filesArray.push( config.files[keyOfFilesObj].name );
        }
        for(let fileName of filesArray) {
            eval(await readFileAsync("./cronFiles/" + fileName, "utf-8"));
        }
    } catch (error) {
        console.log("Err in cron scheduling" + error);
    }
})();





















































// var CronJob = require('cron').CronJob;

// var jobOfSendMail = new CronJob(
//     "* * * * *",
//     async function() {
//         // console.log("Console log from cronDemo1.js file...");
//         let transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//               user: "ravi.malaviya.3795@gmail.com", // generated ethereal user
//               pass: "ravi@3795", // generated ethereal password
//             },
//           });
        
//           var mailOptions = {
//             from: '"Dipesh\'s fake account" <dipesh.fakemail@gmail.com>',
//             to: "dipeshstarkx@gmail.com",
//             subject: "Cron mails at every minute",
//             text : "Here you go...",
//             html : "Mail sent from cron"
//             // text : "http://192.168.1.112:3000/csvFiles/" + fileName
//           };
        
//           transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.log(error);
//                 return false;
//               // res.json({status : "error", error : "There was an error while processing your request..."});
//             } else {
//                 console.log("Email has been sent: " + info.response);
//                 return true;
//               // res.json({status : "success"});
        
//             }
//         });
//     },
//     null,
//     true,
//     'Asia/Kolkata'
// );