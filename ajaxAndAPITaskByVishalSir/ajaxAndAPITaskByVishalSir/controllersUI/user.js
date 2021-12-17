exports.getLogin = function (req, res, next) {
    
    // Do not allow user to login without logout.
    if(req.cookies.authToken){
        return res.redirect("/users");
    }
    res.render('login');
};

exports.getUsers = function (req, res, next) {
    res.render('index');
}