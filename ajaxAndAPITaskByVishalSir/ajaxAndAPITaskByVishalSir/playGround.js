// const fs = require('fs');
// const readline = require('readline');
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
// const file = readline.createInterface({
//     input: fs.createReadStream('./demo.csv'),
//     output: process.stdout,
//     terminal: false
// });



// let count = 0;
// file.on('line', (line) => {
//     console.log(line);
//     count ++;
//     if(count == 1){
//         return;
//     }
// });



// var fs = require('fs');
 
// function get_line(filename, line_no, callback) {
//     var stream = fs.createReadStream(filename, {
//       flags: 'r',
//       encoding: 'utf-8',
//       fd: null,
//       mode: 0666,
//       bufferSize: 64 * 1024
//     });
 
//     var fileData = '';
//     stream.on('data', function(data){
//       fileData += data;
 
//       // The next lines should be improved
//       var lines = fileData.split("\n");
 
//       if(lines.length >= +line_no){
//         stream.destroy();
//         callback(null, lines[+line_no]);
//       }
//     });
 
//     stream.on('error', function(){
//       callback('Error', null);
//     });
 
//     stream.on('end', function(){
//       callback('File end reached without finding line', null);
//     });
 
// }
 
// get_line('public/importedCsvFiles/dipeshTestCase1.csv', 2, function(err, line){
//   console.log('The line: ' + line);
// })
















 // Map csv headers with db feilds according to user's validated choices and send request to upload data to db.
//  this.mapFile = function () {
//   $(document).off('click', "#mapBtn").on('click', "#mapBtn", function () {
      
      // let multiplefeildSelectFlag = false;
      // for( let i = 0; i < $("#mapTable > tbody > tr").length; i++ ){
          // console.log($("select."+i).val(), " ",$("select."+i).val().trim().length );
          // if($("select." + i).val().length != 0){
              // if(mapHeaderObj[$("select."+i).val().trim()]){
              //     multiplefeildSelectFlag = true;
              // }
      //         mapHeaderObj[$("select."+i).val().trim()] = $("select."+i).attr('id').trim();
      //     }
      // }
      // if((mapHeaderObj["email"]) || (mapHeaderObj["contact"])){
          // if(multiplefeildSelectFlag){
          //     $("#warningMessage").html(`Thanks for uploading file.<br>
          //         Selecting same data feild multiple times will consider the last one.We recommend you to reconsider your choices.<br>
          //         Other wise mapping will follow the following pattern.<br>`);
          //     let htmlStr = `<table class="table">
          //                         <thead>
          //                             <tr>
          //                                 <th>Data Feild</th>
          //                                 <th>CSV header in consideration</th>
          //                             </tr>
          //                         </thead>
          //                         <tbody>
          //         `;
          //     for(let key of Object.keys(mapHeaderObj)){
          //         htmlStr += `<tr><td>` + key + `</td><td>` + mapHeaderObj[key] + `</td></tr>`;
          //     }
          //     htmlStr += `            </tr>
          //                         </tbody>
          //                     </table>
          //                     <a id="okBtn" class="btn btn-primary" >Ok</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id="cancelBtn" class="btn btn-secondary">Cancel</a>`;
          //     $("#mapObjTable").html("");
          //     $("#mapObjTable").html(htmlStr);
          //     $(document).scrollTop($(document).height());
          // } else {
              // $("#mapObjTable").html("");
              // $("#warningMessage").html("Thank you for uploading a file.Your request will be processed soon...");
              // _this.uploadUsersToDB();
              // $("div#mapFileDiv").html("");
              // $("div.showUserDiv").css("pointer-events","all");
          // }
//       } else {
//           $("#warningMessage").html("You must map csv header with either email or contact no.");
//       }
//   });
// }














// const csvSplitStream = require('csv-split-stream');
// const fs = require('fs');

 
// return csvSplitStream.split(
//   fs.createReadStream('./demo.csv'),
//   {
//     lineLimit: 2
//   },
//   (index) => fs.createWriteStream(`output-${index}.csv`)
// )
// .then(csvSplitResponse => {
//   console.log('csvSplitStream succeeded.', csvSplitResponse);
//   // outputs: {
//   //  "totalChunks": 350,
//   //  "options": {
//   //    "delimiter": "\n",
//   //    "lineLimit": "10000"
//   //  }
//   // }
// }).catch(csvSplitError => {
//   console.log('csvSplitStream failed!', csvSplitError);
// });



 



// var fs = require('fs');
// var Lazy = require('lazy');
// (async function readFile(){
//   try {
//     var lazy = new Lazy;
//     const data = await fs.promises.readFile("./demo.csv", "binary");
//     console.log(data);

//     Lazy(data).lines.map((line) => {
//       console.log(line);
//     })

//     console.log("aa");
//   } catch (error) {
//     console.log(error);
//   }
// })();  
  


// var fs = require('fs'),
//     byline = require('byline');

//     let strabc = "";
 
// var stream = byline(fs.createReadStream('./demo.csv', { encoding: 'utf8' }));
// let count = 1;
// stream.on('data', function(line) {
//   count++;
//   if(count < 4){
//     console.log(line);
//     strabc += line;
//   }
//   console.log(strabc);
// });

// let prevTime = Date.now();



// var fs = require('fs');
// const byline = require('byline');
// let lineIndex = 0;
// let outputStream = null;
// let chunkIndex = 0;

// let inputStream = (fs.createReadStream("./1_Mil.csv"));
// function split(inputStream, createOutputStreamCallback){

//   let lineStream = byline(inputStream);

//   lineStream.on('data', line => {
//     let count = 1;
//       if (lineIndex === 0 ) {
//         if (outputStream) {
//           outputStream.end();
//         }
//         outputStream = createOutputStreamCallback(chunkIndex++);
//       }
//       outputStream.write(line);
//       outputStream.write("\n");
//       lineIndex = (++lineIndex) % 2;
//       count += 1;
//   });

//   lineStream.on('error', (err) => {
//     if (outputStream) {
//       outputStream.end();
//     }
//   });
// }

// split(inputStream, (index) => {
//   if(index == 0){
//     return  fs.createWriteStream(`output${index}.csv`)
//   }
//   return fs.createWriteStream(`output-hell.csv`);
// });


// let nextTime = Date.now();

// console.log("diff        function    ====>   ", nextTime - prevTime);



// prevTime = Date.now();


// const csv = require("csvtojson");
// async function abc(){
//   let result = await csv().fromFile("./1_Mil.csv");

// }
// abc();

// nextTime = Date.now();
// console.log("diff       csvtojson     ====>   ", nextTime - prevTime);



// fs.unlink('./output0.csv', (err) => {
//   if(err) throw err;
//   console.log("removed.");
// });



function demo(a){
  return new Promise((resolve, reject) => {
    if(a>0){
      resolve(a);
    }
    reject(1);
  })
}

(async function whatever(){
  try {
    let abc = await demo(-3);
    console.log(abc);
    
  } catch (error) {
    console.log(error);
  }
})();











