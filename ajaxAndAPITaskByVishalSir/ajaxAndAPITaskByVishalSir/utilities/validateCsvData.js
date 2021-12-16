const userModel = require("../models/users");
const bcrypt = require("bcryptjs");

function validateEntry(userObj, mapObj){
    let emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let emailValidation = contactValidation = nameValidation = true;
    if(userObj[mapObj["email"]]){
        emailValidation = (userObj[mapObj["email"]].length > 0) && (emailRegExp.test(userObj[mapObj["email"]]));
    }
    if(userObj[mapObj["name"]]){
        nameValidation = (userObj[mapObj["name"]].length > 0)
    }
    if(userObj[mapObj["contact"]]){
        contactValidation = (userObj[[mapObj["contact"]]].toString().length > 0) && (!(isNaN(parseInt(userObj[[mapObj["contact"]]]))));
    }
    return (emailValidation && nameValidation && contactValidation);
    // return ((userObj[mapObj["email"]].length > 0) && (emailRegExp.test(userObj[mapObj["email"]])) && (userObj[mapObj["name"]].length > 0) && (userObj[[mapObj["contact"]]].toString().length > 0) && (!(isNaN(parseInt(userObj[[mapObj["contact"]]])))));
}

async function checkDuplicateEntry (userObj, csvHeaderForEmail, csvHeaderForContact) {
    try {
        // let user = await userModel.findOne({email : userObj[csvHeaderForEmail]});

        let user;
        if(csvHeaderForEmail != undefined) {
            user = await userModel.findOne({email : userObj[csvHeaderForEmail]});
        } else {
            user = await userModel.findOne({contact : userObj[csvHeaderForContact]});
        }

        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.validateCsvData = async function (csvArray, mapObj, addedBy) {
    let duplicateEntryCount = invalidEntryCount = validEntryCount = duplicateEntryInCsvCount = 0;
    let csvArrayLength = csvArray.length;
    let arrayIterator = 0;
    
    let validUserData = [];
    let usersEmail = {};
    let usersContact = {};
    while(arrayIterator < csvArrayLength){
        if(validateEntry(csvArray[arrayIterator], mapObj)){
            validEntryCount += 1;

            if (!(await checkDuplicateEntry(csvArray[arrayIterator], mapObj["email"], mapObj["contact"]))) {

                if(usersEmail[csvArray[arrayIterator][mapObj["email"]]]){
                    duplicateEntryInCsvCount += 1;
                } else if(usersContact[csvArray[arrayIterator][mapObj["contact"]]]){
                    duplicateEntryInCsvCount += 1;
                }
                else {
                    let tempUserObj = {};
                    tempUserObj["name"] = csvArray[arrayIterator][mapObj["name"]] ? csvArray[arrayIterator][mapObj["name"]] : "";
                    tempUserObj["email"] = csvArray[arrayIterator][mapObj["email"]] ? (csvArray[arrayIterator][mapObj["email"]]) : "";
                    tempUserObj["contact"] = csvArray[arrayIterator][mapObj["contact"]] ? (csvArray[arrayIterator][mapObj["contact"]]) : "";
                    tempUserObj["addedBy"] = addedBy;
                    tempUserObj["password"] = bcrypt.hashSync("password", 8);
                    usersEmail[tempUserObj["email"]] = 1;
                    usersContact[tempUserObj["contact"]] = 1;
                    validUserData.push(tempUserObj);
                }
            } else {
                duplicateEntryCount += 1;
            }
        } else {
            invalidEntryCount += 1;
        }
        arrayIterator++;
    }

    return {
        invalidEntryCount,
        validEntryCount,
        duplicateEntryCount,
        duplicateEntryInCsvCount,
        validUserData
    }

}