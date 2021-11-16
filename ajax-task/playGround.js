const qs = require("qs");
const router = require("./routes");

let string = "name=ravi&page=3";

console.log(qs.parse(string));

router.get("/users?search=ravi&page=3")