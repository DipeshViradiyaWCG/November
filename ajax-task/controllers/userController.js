const userModel = require("../models/users");

// Show users from database
exports.showUsers = async function(req, res, next){
    try {
        res.render("index", {} )
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};

// Display users in sorted or non sorted manner as requirement
exports.displayUsers = async function(req, res, next){
    console.log(req.query);
    try {
        let currentPage = req.params.currentPage;
        let paginatedUsers;
        let usersLength;

        // let condition = {};
        // let sortField = {};
        // let currentUrl=  {}

        // let row = 10;

        // var page = 1;
        // var offset = 0;
        // if (current_page) {
        //     page = current_page;
        //     offset = (page - 1) * row;
        // }


        // if(req.params.searchText){
        //     currentUrl["searchText"] = req.params.searchText;
        //     condition["$or"] = [
        //         { name : { $regex : req.params.searchText } },
        //         { address : { $regex : req.params.searchText } }
        //     ]
        // }

        // if(req.params.gender){
        //     condition["gender"] = req.params.gender
        // }


        // if(req.params.feild){
        //     currentUrl["feild"] = req.params.feild;
        //     currentUrl["flag"] = req.params.flag;
        //     sortField[req.params.feild] = req.params.flag;
        // }

        // paginatedUsers = await userModel.find(condition,{state : 0, hobby : 0}).sort(sortField).skip(offset).limit(row);
        // usersLength = await userModel.countDocuments(condition);


        


        
        if(req.params.feild == "undefined"){
            if(req.params.searchText == "undefined"){
                paginatedUsers = await userModel.find({},{state : 0, hobby : 0}).limit(3).skip((currentPage - 1)*3).lean();
                usersLength = await userModel.find({}).count();
            } else {
                paginatedUsers = await userModel.find({ $or : [
                    { name : { $regex : req.params.searchText } },
                    { address : { $regex : req.params.searchText } }
                ] },{state : 0, hobby : 0}).limit(3).skip((currentPage - 1)*3).lean();

                usersLength = await userModel.find({ $or : [
                    { name : { $regex : req.params.searchText } },
                    { address : { $regex : req.params.searchText } }
                ] },{state : 0, hobby : 0}).lean().count();
            }
        } else {
            if(req.params.searchText == "undefined"){
                paginatedUsers = await userModel.find({},{state : 0, hobby : 0}).sort({[req.params.feild] : req.params.flag}).limit(3).skip((currentPage - 1)*3).lean()
                usersLength = await userModel.find({}).count();
            } else {
                paginatedUsers = await userModel.find({ $or : [
                    { name : { $regex : req.params.searchText } },
                    { address : { $regex : req.params.searchText } }
                ] }, {state : 0, hobby : 0}).sort({[req.params.feild] : req.params.flag}).limit(3).skip((currentPage - 1)*3).lean(); 
                usersLength = await userModel.find({ $or : [
                    { name : { $regex : req.params.searchText } },
                    { address : { $regex : req.params.searchText } }
                ] }, {state : 0, hobby : 0}).lean().count(); 
            }
        }

        let prevFlag = true;
        let nextFlag = true;
        if(Number(currentPage) == 1)
            prevFlag = false;
        if (Number(currentPage) == Math.ceil(usersLength/3))
            nextFlag = false;
        console.log("userslength", usersLength);
        // else  
        //     prevFlag = false;
        //     nextFlag = false;
        res.render("displayUsers", {paginatedUsers : paginatedUsers, prevFlag, nextFlag, segmentsArray : Array.from({length: Math.ceil(usersLength/3)}, (_, i) => i + 1)} );
    } catch (error) {
        console.log(error);
        res.json({status : "error", error : "There was an error while processing your request..."});
    }
};
