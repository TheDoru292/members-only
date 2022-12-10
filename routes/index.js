var express = require("express");
var router = express.Router();
require("dotenv").config();

const mongoose = require("mongoose");
const mongoDb = process.env.MONGODB_LINK;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", (error) => console.bind.error(error));

const user = require("../controller/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", user.signup_get);

router.post("/sign-up", user.signup_post);

module.exports = router;
