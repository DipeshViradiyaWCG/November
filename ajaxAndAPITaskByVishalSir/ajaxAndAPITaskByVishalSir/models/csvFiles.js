const mongoose = require("mongoose");

let csvFileSchema = mongoose.Schema({
    name : String,
    mapObject : {
        type : Object
    },
    path : String,
    skipFirstRow : {
        type : Boolean,
        default : false
    },
    totalRecords : {
        type : Number,
        default : 0
    },
    duplicates : {
        type : Number,
        default : 0
    },
    discarded : {
        type : Number,
        default : 0
    },
    totalUploaded : {
        type : Number,
        default : 0
    },
    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    status : {
        type : String,
        default : "pending"
    },
    hasHeaders : {
        type : Boolean,
        default : true
    }
}, { timestamps : true } );

module.exports = mongoose.model("csvFiles", csvFileSchema);