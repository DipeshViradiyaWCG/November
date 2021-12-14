const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');
const moment = require("moment");
const fs = require('fs');

const userModel = require("../models/users");

exports.postLoginAPI = async function (req, res, next) {
    try {
        let user;
        if(isNaN(parseInt(req.body.emailOrContact))) {
            user = await userModel.findOne({email : req.body.emailOrContact});
        } else {
            user = await userModel.findOne({contact : req.body.emailOrContact});
        }

        if(user){
            console.log(bcrypt.compareSync(req.body.password, user.password));
            if(bcrypt.compareSync(req.body.password, user.password)){
                const token = jwt.sign({ email : user.email }, config.jwt.jwtAuthenticationSecretKey, {
                    expiresIn: 1000 * 60 * 60,
                });
                return res.json({ status : "success", code : 200, token });
            } else {
                return res.json({ status : "error", code : 401, message : config.errorMessages[401] });
            }
        } else {
            return res.json({ status : "error", code : 401, message : config.errorMessages[401] });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

exports.getShowUsersAPI = async function (req, res, next) {
    try {
        if(req.query.exportFlag){
            console.log("true patiu");
            let users = await userModel.find({}, {name : 1, email : 1, contact : 1}).lean();
            const fields = [{
                label:"Name",
                value:"name"
            },{
                label:"Email",
                value:"email"
            },{
                label:"Contact",
                value:"contact"
            }];

            const json2csvParser = new Parser({ fields });
            const csvData = json2csvParser.parse(users);

            let fileName = "Users-" + moment().format('YYYY-MM-DD hh:mm') + ".csv";
            fs.writeFile("public/csvFiles/" + fileName, csvData, async (err, data) => {
                if(err) throw err;
                console.log("file created");
                return res.json({ status : "success", code : 200, downloadUrl : "http://192.168.1.112:3000/csvFiles/" + fileName, fileName });
            });
        } 

        let users = await userModel.find({},{_id : 0, password : 0}).lean();
        return res.render('showUsers', { users });
        
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

exports.postAddUserAPI = async function (req, res, next) {
    try {
        let validationErrors = validationResult(req).array();
        if(validationErrors.length == 0){
            let { name, email, contact, password } = req.body;
            await userModel.create({
                name : name,
                email : email,
                contact : contact,
                password : bcrypt.hashSync(password, 8)
            });
            return res.json({ status : "success", code : 200 });
        } else {
            let errs = {};
            for(let err of validationErrors){
            if(errs[err.param] == undefined)
                errs[err.param] = []
            errs[err.param].length < 1 && errs[err.param].push(err.msg)
            }
            console.log(errs);
            return res.json({ status : "error", code : 401, errs});
        }
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

exports.getLogoutAPI = async function (req, res, next) {
    try {
        res.clearCookie('authToken');
        return res.json({ status : "success", code : 200 });
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

