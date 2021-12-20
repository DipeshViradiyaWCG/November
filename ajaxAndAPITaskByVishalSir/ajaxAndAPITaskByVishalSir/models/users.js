const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name : String,
    email : String,
    contact : Number,
    password : String,
    addedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'csvFiles'
    }
}, { strict: false } );

module.exports = mongoose.model("users", userSchema);