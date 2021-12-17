var express = require('express');
var router = express.Router();

const { postLoginAPI, getShowUsersAPI, postAddUserAPI, getLogoutAPI, postImportFileAPI, postMapAndUploadUsersAPI, getShowFilesAPI } = require('../controllersAPI/user');
const { check } = require('express-validator');
const userModel = require("../models/users");

// Multer initialization for file upload
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/importedCsvFiles");
  },
  filename: (req, file, cb) => {
    cb(null, `User-${req.user.name}-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({
  storage: multerStorage
});

router.post('/login', postLoginAPI);

router.get('/showUsers', authAPI.authAPI, getShowUsersAPI);

router.get('/showFiles', authAPI.authAPI, getShowFilesAPI);

// Sanatize and validate user data for duplication.
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
    .withMessage("Contact is required")
    .custom(async (value) => {
      let userObj = await userModel.findOne({contact : value}).lean();
      if(userObj)
          throw new Error("Entered contact account already exists...");
      return true;
    }),
    check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({min : 6})
    .withMessage("Password should be 6 characters long")
], postAddUserAPI);

router.post('/importFile', authAPI.authAPI, upload.single("importFile"), postImportFileAPI);

router.post('/uploadUsersToDB', authAPI.authAPI, postMapAndUploadUsersAPI);

router.get('/logout', getLogoutAPI);

module.exports = router;
