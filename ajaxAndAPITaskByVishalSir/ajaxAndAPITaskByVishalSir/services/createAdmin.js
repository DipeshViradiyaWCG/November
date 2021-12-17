const bcrypt = require("bcryptjs");

const userModel = require("../models/users");

// create a by default master admin on first time server start.
(async function createAdmin(){
    try {
        let adminExist = await userModel.find({email : "admin@admin.com"}).lean();
        if(!(adminExist.length > 0)){
            await userModel.create({
                name: "Admin",
                email: "admin@admin.com",
                contact: "1234567890",
                password: bcrypt.hashSync("123456", 8)
            });
            console.log("admin created");
        } else {
            console.log("admin exist");
        }
    } catch (error) {
        console.log(error);
    }
})();