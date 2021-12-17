const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');
const moment = require("moment");
const fs = require('fs');
const csv = require("csvtojson");

const { validateCsvData } = require("../utilities/validateCsvData");

// requiring db model
const userModel = require("../models/users");
const csvFileModel = require("../models/csvFiles");

// verify user credentials and generate token
exports.postLoginAPI = async function (req, res, next) {
    try {
        let user;
        if(isNaN(parseInt(req.body.emailOrContact))) {
            user = await userModel.findOne({email : req.body.emailOrContact});
        } else {
            user = await userModel.findOne({contact : req.body.emailOrContact});
        }

        if(user){
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

// process get users request for verified token
exports.getShowUsersAPI = async function (req, res, next) {
    try {
        if(req.query.exportFlag){
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

        let users = await userModel.find({},{_id : 0, password : 0}).populate({
            path : "addedBy",
            select : "name"
        }).lean();
        return res.render('showUsers', { users });

    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

// get files data from db
exports.getShowFilesAPI = async function (req, res, next) {
    try {
        let files = await csvFileModel.find({},{mapObject : 0, path : 0, skipFirstRow : 0, _id : 0}).lean();
        return res.render('showFiles', { files });
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
}

// Add validated user data to db
exports.postAddUserAPI = async function (req, res, next) {
    try {
        let validationErrors = validationResult(req).array();
        if(validationErrors.length == 0){
            let { name, email, contact, password } = req.body;
            await userModel.create({
                name : name,
                email : email,
                contact : contact,
                password : bcrypt.hashSync(password, 8),
                addedBy : req.user._id
            });
            return res.json({ status : "success", code : 200 });
        } else {
            let errs = {};
            for(let err of validationErrors){
                if(errs[err.param] == undefined)
                    errs[err.param] = []
                errs[err.param].length < 1 && errs[err.param].push(err.msg)
            }
            return res.json({ status : "error", code : 401, errs});
        }
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

// convert file from csv to json and send first two rows and db feilds for mapping
exports.postImportFileAPI = async function (req, res, next) {
    try {
        let result = await csv().fromFile("public/importedCsvFiles/" + req.file.filename);

        // An aggregation query to generate array of db collection feilds
        let collectionFeildsList = await userModel.aggregate([
            {
                "$project" : {
                    "arrayofkeyvalue" : {
                        "$objectToArray" : "$$ROOT"
                    }
                }
            },{
                "$unwind" : "$arrayofkeyvalue"
            },{
                "$group" : { 
                    "_id" : null,
                    "allkeys" : {
                        "$addToSet" : "$arrayofkeyvalue.k"
                    }
                }
            }
        ]);
        collectionFeildsList = collectionFeildsList[0]["allkeys"];
        
        collectionFeildsList.splice(collectionFeildsList.indexOf("_id"),1);
        collectionFeildsList.splice(collectionFeildsList.indexOf("__v"),1);
        collectionFeildsList.splice(collectionFeildsList.indexOf("password"),1);
        collectionFeildsList.splice(collectionFeildsList.indexOf("addedBy"),1);
        collectionFeildsList.map((value) => value.trim());
        let csvFileObj = await csvFileModel.create({
            name : req.file.filename,
            path : "public/importedCsvFiles/" + req.file.filename,
            uploadedBy : req.user._id
        });

        res.render('csvMapTable', { 
            collectionFeildsList, 
            firstRow : Object.keys(result[0]).map((value) => value.trim()),
            secondRow : Object.values(result[0]).map((value) => value.trim()), 
            fileUploaded : req.file.filename, 
            fileId : csvFileObj._id 
        });
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

// Validate csv file data and map it with user's choice, Upload valid data to DB, send confirmation to user.
exports.postMapAndUploadUsersAPI = async function (req, res, next) {
    try {
        let result = await csv().fromFile("public/importedCsvFiles/" + req.query.fileUploaded);
        let validatedUsersData = await validateCsvData(result, req.body, req.query.fileId);

        if(validatedUsersData.validUserData.length > 0){
            await userModel.insertMany(validatedUsersData.validUserData);
        }
        await csvFileModel.updateOne({ _id : req.query.fileId} , {
            mapObject : req.body,
            totalRecords : result.length,
            duplicates : validatedUsersData.duplicateEntryCount,
            discarded : validatedUsersData.duplicateEntryInCsvCount,
            totalUploaded : validatedUsersData.validUserData.length,
            status : "uploaded"
        })
        let message = `<br>Thank you for uploading data file.<br>
            Out of total ${result.length} records, we found,<br>
            ${validatedUsersData.invalidEntryCount} Invalid data entries,<br>
            ${validatedUsersData.validEntryCount} Valid data entries,<br>
            Out of which ${validatedUsersData.duplicateEntryCount} records were already in existance,<br>
            We also ignored ${validatedUsersData.duplicateEntryInCsvCount} records which were duplicates in csv file itself... :)<br>
            We added total ${validatedUsersData.validUserData.length} records to database.`;

        return res.json({ status : "success", code : 200, message });

    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
}

// clear cookie and logout user
exports.getLogoutAPI = async function (req, res, next) {
    try {
        res.clearCookie('authToken');
        return res.json({ status : "success", code : 200 });
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : config.errorMessages[404] });
    }
};

