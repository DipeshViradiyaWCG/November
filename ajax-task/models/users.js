const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name : String,
    address : String,
    state : String,
    gender : String,
    hobby : [{
        type: String
    }],
    profile : String
}, { timestamps: true } );

module.exports = mongoose.model("users", userSchema);