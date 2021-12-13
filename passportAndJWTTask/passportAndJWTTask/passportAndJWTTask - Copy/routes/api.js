var express = require('express');
const passport = require("passport");
var router = express.Router();
const { postSignupAPI, postLoginAPI, getProfileAPI, postChangePasswordAPI } = require('../api/users');

require("../services/passportJWT");

router.post('/signup', postSignupAPI);
router.post('/login', postLoginAPI);
router.get('/profile', passport.authenticate("jwt", { session: false }), getProfileAPI);
router.post('/changePassword', passport.authenticate("jwt", { session: false }), postChangePasswordAPI);

module.exports = router;
