const userModel = require("../models/users");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.getSignup = function (req, res, next) {
    res.render("signup");
};

exports.postSignup = async function (req, res, next) {
    try {
        let { name, email, gender, password, contact } = req.body;
    
        const hashPassword = bcrypt.hashSync(password, 8);
        await userModel.create({
          name,
          password: hashPassword,
          email,
          gender,
          contact
        });
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.render('signup', { message : "Error in signup, try again..."});
    }
};

exports.getLogin = function (req, res, next) {
    res.render("login");
};

exports.postLogin = async function (req, res, next) {
    passport.authenticate('local',{
        failureRedirect : '/login',
        successRedirect :'/profile',
    })(req,res,next); 
};

exports.getProfile = async function (req, res, next) {
    res.render('index', {user : JSON.parse(JSON.stringify(req.user))});
};

exports.getChangePassword = async function (req, res, next) {
    res.render('changePassword');
};

exports.postChangePassword = async function (req, res, next) {
    let { oldPassword, newPassword } = req.body;
    try {
        let user = await userModel.findOne({email : req.user.email}).lean();
        bcrypt.compare(oldPassword, user.password, function(err, resp){
            if(resp){
                bcrypt.genSalt(8, (err, salt) => {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if(err){
                            return res.render('changePassword', { message : "Error in change password, try again...11"});
                        }
                        userModel.updateOne({email : req.user.email}, {password : hash}, function(err, data){
                            if(err){
                                console.log(err);
                                return res.render('changePassword', { message : "Error in change password, try again...11"});
                            }
                            return res.redirect('/profile');
                        });
                    });
                });
            } else {
                return res.render('changePassword', { message : "Error in change password, try again...22"});
            }
        });
    } catch (error) {
        console.log(error);
        return res.render('changePassword', { message : "Error in change password, try again...33"});
    }
};

exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/login');
};


