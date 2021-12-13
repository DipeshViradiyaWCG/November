const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postSignupAPI = async function (req, res,next) {
    try {
        let { email, name, gender, password, contact } = req.body;
        await userModel.create({
          email,
          name,
          gender,
          password: bcrypt.hashSync(password, 8),
          contact
        });
        res.json({ status: "success", message : "User signed up successfully..."});
      } catch (error) {
        console.log(error);
        return res.json({ status : "error", message : "Error in signup, try again..."});
      }
};

exports.postLoginAPI = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ email }, "asdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsa", {
                    expiresIn: 4000000,
                });
                return res.status(200).json({user, token});
            } else {
                return res.json({ status : "error", message : "email or password invalid" });
            }
        } else {
            return res.json({ status : "error", message : "email or password invalid" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", message : "email or password invalid" });
    }
};

exports.getProfileAPI = async function (req, res, next) {
    try {
        let jwtFromRequest = req.headers.authorization.split(" ")[1];
        let payLoad = jwt.verify(jwtFromRequest, "asdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsa");
  
        let user = await userModel.findOne(
            { email: payLoad.email },
            { email: 1, gender: 1, name: 1, contact : 1, _id: 0 }
        );
        res.json({status : "success", user});
    } catch (error) {
        return res.json({ status : "error", message : "email or password invalid" });
    }
};

exports.postChangePasswordAPI = async function (req, res, next) {
    let { oldPassword, newPassword } = req.body;
    try {
        let user = await userModel.findOne({email : req.user.email}).lean();
        bcrypt.compare(oldPassword, user.password, function(err, resp){
            if(resp){
                bcrypt.genSalt(8, (err, salt) => {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if(err){
                            return res.json({status : "error",  message : "Error in change password, try again..."});
                        }
                        userModel.updateOne({email : req.user.email}, {password : hash}, function(err, data){
                            if(err){
                                console.log(err);
                                return res.json({status : "error",  message : "Error in change password, try again..."});
                            }
                            return res.json({status : "success", message : "Password changed..."});
                        });
                    });
                });
            } else {
                return res.json({status : "error",  message : "Error in change password, try again..."});
            }
        });
    } catch (error) {
        console.log(error);
        return res.json({ status : "error", message : "Error in change password, try again..."});        
    }
};
