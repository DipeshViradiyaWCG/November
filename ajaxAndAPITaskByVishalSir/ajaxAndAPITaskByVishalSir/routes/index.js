var express = require('express');
var router = express.Router();

const { getLogin, getUsers } = require("../controllersUI/user");
const { isLogin } = require('../middlewares/isLogin');

router.get('/', getLogin);

router.get('/users', isLogin, getUsers);

module.exports = router;
