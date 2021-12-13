const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    contact : Number,
    gender : String
});

module.exports = mongoose.model("users", userSchema);