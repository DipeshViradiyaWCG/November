const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/users");

exports.postLoginAPI = async function (req, res, next) {
    try {
        let user = await userModel.findOne({
            or : [ { email : req.body.emailOrContact}, { contact : req.body.emailOrContact } ]
        });
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                const token = jwt.sign({ email : user.email }, "asdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsa", {
                    expiresIn: 1000 * 60 * 60,
                });
                return res.json({ status : "success", code : 200, token });
            } else {
                console.log("else");
                return res.json({ status : "error", code : 401, message : "Wrong credentials." });
            }
        } else {
            return res.json({ status : "error", code : 401, message : "Wrong credentials." });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : "Something went wrong" });
    }
};

exports.getShowUsersAPI = async function (req, res, next) {
    try {
        let payLoad = jwt.verify(req.headers.authtoken, "asdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsa");
        if(payLoad){
            let users = await userModel.find({},{_id : 0, password : 0}).lean();
            return res.render('showUsers', {users});
        } else {
            return res.json({ status : "error", code : 404, message : "Something went wrong" })
        }
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", code : 404, message : "Something went wrong" });
    }
};