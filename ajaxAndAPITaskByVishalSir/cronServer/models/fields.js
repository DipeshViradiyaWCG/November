const mongoose = require("mongoose");

let feildSchema = mongoose.Schema({
    key : {
        type:String
    }
});

module.exports = mongoose.model("feilds", feildSchema, "feilds");