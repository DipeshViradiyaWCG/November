const bcrypt = require("bcryptjs");

// const userModel = require("../models/users");

exports.getLogin = function (req, res, next) {
    res.render('login');
};

exports.getUsers = function (req, res, next) {
    res.render('index');
}