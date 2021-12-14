var express = require('express');
var router = express.Router();

const { postLoginAPI, getShowUsersAPI, postAddUserAPI, getLogoutAPI, getExportUsers } = require('../controllersAPI/user');
const { check } = require('express-validator');
const userModel = require("../models/users");

router.post('/login', postLoginAPI);

router.get('/showUsers', authAPI.authAPI, getShowUsersAPI);

router.post('/addUser', authAPI.authAPI, [
    check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required"),
    check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .custom(async (value) => {
        let userObj = await userModel.findOne({email : value}).lean();
        if(userObj)
            throw new Error("Entered email account already exists...");
        return true;
    }),
    check("contact")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Contact is required"),
    check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({min : 6})
    .withMessage("Password should be 6 characters long")
], postAddUserAPI);

router.get('/logout', getLogoutAPI);

module.exports = router;
