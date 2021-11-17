const userModel = require("../models/users");
const { Parser } = require('json2csv');
const fs = require('fs')
const { getClientIp } = require('@supercharge/request-ip')
const nodemailer = require("nodemailer");


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
    console.log(req.query);
    try {
        let currentPage = req.query.currentPage;
        console.log("currentPage", currentPage);
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
        
        if(req.query.searchGender != "all"){
            findCondition["gender"] = req.query.searchGender;
            currentPage = 1;
        }
        
        if(req.query.feild){
            currentUrl["feild"] = req.query.feild;
            currentUrl["flag"] = req.query.flag;
            sortCondition[req.query.feild] = req.query.flag;
        }
        
        if(req.query.exportFlag){
            paginatedUsers = await userModel.find( findCondition, {name : 1, address : 1, gender : 1, state : 1, hobby : 1,_id:0}).sort(sortCondition).lean();    
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
            }]

            const json2csvParser = new Parser({ fields});
            const csvData = json2csvParser.parse(paginatedUsers);

            let fileName = "D-" + getClientIp(req) + "-" + Date.now() + ".csv";
            fs.writeFile("public/csvFiles/" + fileName, csvData, (err, data) => {
                if(err) throw err;
                console.log("file created");
                if(req.query.exportEmailFlag){
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                          user: "ravi.malaviya.3795@gmail.com", // generated ethereal user
                          pass: "ravi@3795", // generated ethereal password
                        },
                      });
                    
                      var mailOptions = {
                        from: '"Dipesh\'s fake account" <dipesh.fakemail@gmail.com>',
                        to: req.query.exportEmail,
                        subject: "A link to download requested CSV file",
                        text : "http://192.168.1.112:3000/csvFiles/" + fileName
                      };
                    
                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.json({status : "error", error : "There was an error while processing your request..."});
                        } else {
                          console.log("Email has been sent: " + info.response);
                          res.json({status : "success"});

                        }
                    });
                }
                res.json({status : "success", downloadUrl : "http://192.168.1.112:3000/csvFiles/" + fileName})
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
    
        // console.log("paginatedUsers", paginatedUsers);
        res.render("displayUsers", {paginatedUsers : paginatedUsers, prevFlag, nextFlag, currentUrl : JSON.stringify(currentUrl),qs:qs, segmentsArray : Array.from({length: Math.ceil(usersLength/3)}, (_, i) => i + 1)} );
        
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};
