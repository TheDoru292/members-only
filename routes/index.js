var express = require("express");
var router = express.Router();
require("dotenv").config();

const mongoose = require("mongoose");
const mongoDb = process.env.MONGODB_LINK;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", (error) => console.bind.error(error));

const user = require("../controller/userController");
const post = require("../controller/postController");

const Post = require("../models/post");

/* GET home page. */
router.get("/", function (req, res, next) {
  Post.find({})
    .populate("user")
    .exec((err, result) => {
      if (err) {
        return next(err);
      }

      res.render("index", { posts: result });
    });
});

router.get("/sign-up", user.signup_get);

router.post("/sign-up", user.signup_post);

router.get("/log-in", user.login_get);

router.post("/log-in", user.login_post);

router.get("/sign-out", user.signout_get);

router.get("/join-the-club", user.join_the_club_get);

router.post("/join-the-club", user.join_the_club_post);

router.get("/admin", user.admin_get);

router.post("/admin", user.admin_post);

router.get("/create-post", post.create_post_get);

router.post("/create-post", post.create_post);

router.post("/delete-post", post.delete_post);

module.exports = router;
