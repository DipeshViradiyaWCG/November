// // const qs = require("qs");
// // const router = require("./routes");

// const { db } = require("./models/users");

// // let string = "name=ravi&page=3";

// // console.log(qs.parse(string));

// // router.get("/users?search=ravi&page=3")


// // const { parse } = require('json2csv');

// // const fields = ['field1', 'field2'];
// // const opts = { fields };

// // myData = [
// //     {
// //         field1 : "abc",
// //         field2 : "def"
// //     },
// //     {
// //         field1 : "abc",
// //         field2 : "def"
// //     },
// //     {
// //         field1 : "abc",
// //         field2 : "def"
// //     },
// //     {
// //         field1 : "abc",
// //         field2 : "def"
// //     },
// //     {
// //         field1 : "abc",
// //         field2 : "def"
// //     }
// // ];

// // // try {
// // //   const csv = parse(myData, opts);
// // //   console.log(typeof csv);
// // // } catch (err) {
// // //   console.error(err);
// // // }


// // const moment = require("moment");

// // let a = moment(moment(moment.utc()).toDate()).format('YYYY-MM-DD HH:mm:ss');
// // let aa = moment(moment.utc("Thu Nov 18 2021 04:29:59 GMT+0000 (Coordinated Universal Time)").toDate()).format('YYYY-MM-DD HH:mm:ss');
// // // let aaa = moment(moment(ISODate("2021-11-18T04:29:59.061Z")).toDate()).format('YYYY-MM-DD HH:mm:ss');
// // let aaaa = moment(moment("2021-11-18T04:29:59.061Z").toDate()).format('YYYY-MM-DD HH:mm:ss');



// // // ISODate("2021-11-18T04:29:59.061Z")
// // // Thu Nov 18 2021 04:29:59 GMT+0000 (Coordinated Universal Time)

// // console.log(a);
// // console.log(aa);
// // // console.log(aaa);
// // console.log(aaaa);
// // // console.log(UTCTimeGloabal);






// // db.getCollection('minipcategories').aggregate([{$looup : {
// //     from : "minipsubcategories",
// //     localField : "_id",
// //     foreignField : "_category" ,
// //     pipeline: [{$project : {
        
// //     }}],
// //     as : "subcategories",
// // }}])

// let count = 0

// var CronJob = require('cron').CronJob;
// var job = new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// console.log(count++);
// }, null, true, 'America/Los_Angeles');
// job.start();

// const fs = require("fs");
// const { promisify } = require("util");
// let temp;
// fs.readFile("./playGround2.js", "utf-8", (err, data) => {
//     if(err)
//         console.log(err);
//     else{
//         eval(data);
//     }
// });

// let readFileAsync = promisify(fs.readFile);
// async function loadCode() {
//     eval(await readFileAsync("./playGround2.js", "utf-8"));
// };

// loadCode();
// console.log(temp);
// eval(temp);





// import { createClient } from 'redis';
const { createClient } = require("redis");

(async () => {
  const client = createClient();

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

//   await client.set('key1', '1');
//   await client.set('key2', '2');
//   await client.set('key3', '3');
//   await client.set('key4', 'value4');
//   await client.set('key5', 'value5');
//   await client.set('key6', 'value6');

    // await client.del("key");

//   console.log(await client.get('key1'));
//   console.log(await client.get('key2'));
//   console.log(await client.get('key3'));
//   console.log(await client.get('key4'));
//   console.log(await client.get('key5'));
//   console.log(await client.get('key6'));
})();