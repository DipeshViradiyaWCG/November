exports.getLogin = function (req, res, next) {
    res.render('login');
};

exports.getUsers = function (req, res, next) {
    res.render('index');
}