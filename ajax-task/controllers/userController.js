const userModel = require("../models/users");

// Show users from database
exports.showUsers = async function(req, res, next){
    try {
        let users = await userModel.find({},{state : 0, hobby : 0}).lean();
        res.render("index", {users : users} )
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};

