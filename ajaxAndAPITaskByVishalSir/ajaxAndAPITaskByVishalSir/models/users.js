const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name : String,
    email : String,
    contact : Number,
    password : String
});

module.exports = mongoose.model("users", userSchema);