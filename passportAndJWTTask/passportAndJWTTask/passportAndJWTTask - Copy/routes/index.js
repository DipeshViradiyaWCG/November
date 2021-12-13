var express = require('express');
const { getSignup, getLogin, postSignup, postLogin, getProfile, logout, getChangePassword, postChangePassword } = require('../controllers/userController');
const { isLogin } = require('../middlewares/isLogin');
var router = express.Router();

require("../services/passportLocal");

/* GET home page. */
router.get('/', getSignup);
router.post('/', postSignup);

router.get('/login', getLogin);
router.post('/login', postLogin);

router.get('/profile', isLogin, getProfile);

router.get('/changePassword', isLogin, getChangePassword);
router.post('/changePassword', isLogin, postChangePassword);

router.get('/logout', logout);

module.exports = router;
