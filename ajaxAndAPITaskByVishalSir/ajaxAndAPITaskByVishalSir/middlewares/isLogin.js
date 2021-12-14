const jwt = require("jsonwebtoken");

exports.isLogin = function (req, res, next) {
    console.log("req.cookies",  req.cookies.authToken);
    if(req.cookies.authToken){
        let payLoad = jwt.verify(req.cookies.authToken, config.jwt.jwtAuthenticationSecretKey);
        if(payLoad){
            next();
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
};
