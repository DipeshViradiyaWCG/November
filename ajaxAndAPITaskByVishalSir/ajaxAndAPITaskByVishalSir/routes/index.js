var express = require('express');
var router = express.Router();

const { getLogin, getUsers } = require("../controllersUI/user");

router.get('/', getLogin);

router.get('/users', isLogin.isLogin, getUsers);

module.exports = router;
