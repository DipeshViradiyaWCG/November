const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

// Verify API request header token and authenticate user.
exports.authAPI = async function (req, res, next) {
    if(req.headers.authtoken){
        let payLoad = jwt.verify(req.headers.authtoken, config.jwt.jwtAuthenticationSecretKey);
        try {
            let user = await userModel.findOne({email : payLoad.email});
            if(user){
                req.user = user
                next();
            } else {
                return res.json({ status : "error", code : 422, message : config.errorMessages[422] });    
            }
        } catch (error) {
            console.log(error);
            return res.json({ status : "error", code : 500, message : config.errorMessages[500] });
        }
    }else{
        return res.json({ status : "error", code : 422, message : config.errorMessages[422] }); 
    }
};

