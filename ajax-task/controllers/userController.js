const userModel = require("../models/users");
const emailScheduleModel = require("../models/emailSchedule");
const { Parser } = require('json2csv');
const fs = require('fs')
const moment = require("moment");
const nodemailer = require("nodemailer");
const { sendMailService } = require("../services/sendMailService");


// Show users from database
exports.showUsers = async function(req, res, next){
    try {
        res.render("index", {} )
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};

// Display users in sorted or non sorted manner and process search query as requirement
exports.displayUsers = async function(req, res, next){
    try {
        let currentPage = req.query.currentPage;
        let paginatedUsers;
        let usersLength;
        
        let findCondition = {};
        let sortCondition = {};
        let currentUrl= {};
        
        if(req.query.searchText){
            findCondition["$or"] = [
                { name : { $regex : req.query.searchText } },
                { address : { $regex : req.query.searchText } }
            ]
            currentPage = 1;
        }
        
        if(req.query.searchGender != "all")
            findCondition["gender"] = req.query.searchGender;

        if(req.query.feild){
            currentUrl["feild"] = req.query.feild;
            currentUrl["flag"] = req.query.flag;
            sortCondition[req.query.feild] = req.query.flag;
        }

        if(req.query.redirectFlag){
            currentPage = 1;
        }
        
        // Create a csv file and send a link to download / to mail user
        if(req.query.exportFlag){
            paginatedUsers = await userModel.find( findCondition, {name : 1, address : 1, gender : 1, state : 1, hobby : 1, _id : 0, createdAt : 1}).sort(sortCondition).lean();    
            for(let user of paginatedUsers){
                user["hobby"] = user["hobby"].join(",");
            }

            const fields = [{
                label:"Name",
                value:"name"
            },{
                label:"Gender",
                value:"gender"
            },{
                label:"Address",
                value:"address"
            },{
                label:"State",
                value:"state"
            },{
                label:"Hobby",
                value:"hobby"
            },{
                label:"Created at",
                value: (row) => moment(row.createdAt).utcOffset("+05:30").format("YYYY-MM-DD HH:mm a")
            }]

            const json2csvParser = new Parser({ fields});
            const csvData = json2csvParser.parse(paginatedUsers);

            let fileName = "Users-" + moment().format('YYYY-MM-DD hh:mm') + ".csv";
            fs.writeFile("public/csvFiles/" + fileName, csvData, async (err, data) => {
                if(err) throw err;
                console.log("file created");
                if(req.query.exportEmailFlag){
                    // let transporter = nodemailer.createTransport({
                    //     service: "gmail",
                    //     auth: {
                    //       user: "ravi.malaviya.3795@gmail.com", // generated ethereal user
                    //       pass: "ravi@3795", // generated ethereal password
                    //     },
                    //   });
                    
                    //   var mailOptions = {
                    //     from: '"Dipesh\'s fake account" <dipesh.fakemail@gmail.com>',
                    //     to: req.query.exportEmail,
                    //     subject: "A link to download requested CSV file",
                    //     text : "http://192.168.1.112:3000/csvFiles/" + fileName
                    //   };
                    
                    //   transporter.sendMail(mailOptions, function (error, info) {
                    //     if (error) {
                    //         console.log(error);
                    //         res.json({status : "error", error : "There was an error while processing your request..."});
                    //     } else {
                    //       console.log("Email has been sent: " + info.response);
                    //       res.json({status : "success"});

                    //     }
                    // });



                    // if(sendMailService(req.query.exportEmail, "http://192.168.1.112:3000/csvFiles/" + fileName)){
                    //     // console.log("Email has been sent: " + info.response);
                    //     res.json({status : "success"});
                    // } else {
                    //     // console.log(error);
                    //     res.json({status : "error", error : "There was an error while processing your request..."});
                    // }


                    try {
                        await emailScheduleModel.create({
                            receiverEmail : req.query.exportEmail,
                            receiverEmailText : "http://192.168.1.112:3000/csvFiles/" + fileName
                        });
                        res.json({status : "success"});
                    } catch (error) {
                        res.json({status : "error", error : "There was an error while processing your request..."});
                    }                    
                }
                console.log(fileName);
                res.json({status : "success", downloadUrl : "http://192.168.1.112:3000/csvFiles/" + fileName, fileName})
            });
            return;
        }

        paginatedUsers = await userModel.find( findCondition, {state : 0, hobby : 0}).sort(sortCondition).skip((currentPage - 1)*3).limit(3).lean();
        usersLength = await userModel.countDocuments(findCondition);
        
        let prevFlag = true;
        let nextFlag = true;
        if(Number(currentPage) == 1)
            prevFlag = false;
        if (Number(currentPage) == Math.ceil(usersLength/3))
            nextFlag = false;
        
        const qs = Object.keys(currentUrl)
        .map(key => `${key}=${currentUrl[key]}`)
        .join('&');

        res.render("displayUsers", {
            paginatedUsers, 
            prevFlag, 
            nextFlag, 
            currentPage, 
            currentUrl : JSON.stringify(currentUrl),
            qs:qs,
            segmentsArray : Array.from({length: Math.ceil(usersLength/3)}, (_, i) => i + 1)} );
        
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};
