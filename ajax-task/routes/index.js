var express = require('express');
var router = express.Router();

// API functions and controllers
const { addUser , deleteUser, editUserGet, editUserPut, sortUsers } = require('../api/userFunctions');
const { showUsers, displayUsers} = require('../controllers/userController');

// Multer initialization for file upload
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `D-${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({
  storage: multerStorage
});

// routes
router.get('/', showUsers);
router.post('/', upload.single("profile"), addUser);
router.get('/:id', editUserGet);
router.put('/:id',upload.single("profile"), editUserPut);
router.delete('/:id', deleteUser);

router.get("/displayUsers/:currentPage/:feild/:flag/:searchText/:searchGender",displayUsers);

// router.get('/sort/:feild/:flag', sortUsers);

module.exports = router;
