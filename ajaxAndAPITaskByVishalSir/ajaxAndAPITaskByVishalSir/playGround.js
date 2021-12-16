const fs = require('fs');
const readline = require('readline');
// const csv = require("csvtojson");

// (async function readFile(){
//     const data = await fs.promises.readFile("public/importedCsvFiles/User-Admin-1639550686965.csv", "binary");
//     console.log(data);
//     let result= await csv().fromFile("public/importedCsvFiles/User-Admin-1639550686965.csv");
//     console.log(result);
// })();

// function validateEntry(userObj){
//     let emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//     console.log("11", userObj["Phone Number"].toString().length > 0);
//     return ((emailRegExp.test(userObj.Email)) && (userObj.Email.length > 0) && (userObj.Name.length > 0) && (userObj["Phone Number"].toString().length > 0) && (!(isNaN(parseInt(userObj["Phone Number"])))));
// }

// console.log(validateEntry({
//     Name : "abc",
//     Email : "abc@gmail.com",
//     "Phone Number" : 789456123
// }));
// console.log(validateEntry({
//     Name : "",
//     Email : "abc.com",
//     "Phone Number" : 789456123
// }));
// (async function readFile(){
//     const data = await fs.promises.readFile("./demo.csv", "binary");
//     console.log(data);
// })();
const file = readline.createInterface({
    input: fs.createReadStream('./demo.csv'),
    output: process.stdout,
    terminal: false
});

let count = 0;
file.on('line', (line) => {
    console.log(line);
    count ++;
    if(count == 1){
        return;
    }
});