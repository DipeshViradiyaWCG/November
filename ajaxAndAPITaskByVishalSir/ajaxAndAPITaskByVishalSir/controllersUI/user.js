exports.getLogin = function (req, res, next) {
    if(req.cookies.authToken){
        return res.redirect("/users");
    }
    res.render('login');
};

exports.getUsers = function (req, res, next) {
    res.render('index');
}