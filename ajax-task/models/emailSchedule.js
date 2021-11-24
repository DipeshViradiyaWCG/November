const mongoose = require("mongoose");

let emailScheduleSchema = mongoose.Schema({
    receiverEmail : String,
    receiverEmailText : String,
    status : {
        type: Number, 
        default: 0
    }
});

module.exports = mongoose.model("emailSchedule", emailScheduleSchema);