// const qs = require("qs");
// const router = require("./routes");

// let string = "name=ravi&page=3";

// console.log(qs.parse(string));

// router.get("/users?search=ravi&page=3")


const { parse } = require('json2csv');

const fields = ['field1', 'field2'];
const opts = { fields };

myData = [
    {
        field1 : "abc",
        field2 : "def"
    },
    {
        field1 : "abc",
        field2 : "def"
    },
    {
        field1 : "abc",
        field2 : "def"
    },
    {
        field1 : "abc",
        field2 : "def"
    },
    {
        field1 : "abc",
        field2 : "def"
    }
];

try {
  const csv = parse(myData, opts);
  console.log(typeof csv);
} catch (err) {
  console.error(err);
}