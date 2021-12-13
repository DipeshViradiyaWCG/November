var express = require('express');
const { postLoginAPI, getShowUsersAPI } = require('../controllersAPI/user');
var router = express.Router();

router.post('/login', postLoginAPI);

router.get('/showUsers', getShowUsersAPI);

module.exports = router;

