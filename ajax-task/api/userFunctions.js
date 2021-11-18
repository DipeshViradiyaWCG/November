const userModel = require("../models/users");

// Add user in database
exports.addUser = async function(req, res, next){
    try {
        let addUserObj = {
            name : req.body.firstName + " " +req.body.lastName,
            address : req.body.address,
            state : req.body.state,
            gender : req.body.gender,
            hobby : JSON.parse(req.body.hobby),
        }
        if(req.file){
            addUserObj["profile"] = req.file.filename;
        } else {
            addUserObj["profile"] = "profile.jpeg";
        }
        await userModel.create(addUserObj);
        res.json({status : "success"});
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};

// Delete user from database
exports.deleteUser = async function (req, res, next) {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.json({status : "success"});
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};

// Get user by id for edit request
exports.editUserGet = async function (req, res, next) {
    try {
        let user = await userModel.findById(req.params.id);
        res.json({status : "success", user : user});
       
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};

// Edit user in database
exports.editUserPut = async function (req, res, next) {
    try {
        updateUserObj = {
            name : req.body.firstName + " " +req.body.lastName,
            address : req.body.address,
            state : req.body.state,
            gender : req.body.gender,
            hobby : JSON.parse(req.body.hobby)
        }
        if(req.file){
            updateUserObj["profile"] = req.file.filename;
        }
        let user = await userModel.findByIdAndUpdate(req.params.id, updateUserObj, {new : true});
        res.json({status : "success", user : user});
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};

// Sort users by feild name
exports.sortUsers = async function(req, res, next){
    try {
        // let feild = req.params.feild;
        let users = await userModel.find({}).sort({[req.params.feild] : req.params.flag});
        res.json({status : "success", users : users})
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});    
    }
};