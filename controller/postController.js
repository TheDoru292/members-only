const Post = require("../models/post");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.create_post_get = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/log-in?redirect=create-post");
  }
  res.render("create_post", { title: "Create post" });
};

exports.create_post = [
  body("title").trim().escape(),
  body("text").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const postObj = {
      user: req.user._id,
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
    };

    if (!req.user) {
      return res.status(401).send({ message: "You're not authorized." });
    }

    if (!errors.isEmpty()) {
      return res.render("create_post", {
        title: "Create post",
        post: postObj,
        errors: errors,
      });
    }

    User.findById({ _id: req.user._id }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).send({ message: "You're not authorized." });
      }

      Post.create(postObj, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },
];

exports.delete_post = [
  body("id").trim().escape(),

  (req, res, next) => {
    if (req.user.admin == true) {
      Post.findByIdAndRemove({ _id: req.body.id }, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect("/");
      });
    } else {
      return res
        .status(401)
        .send({ message: "You don't have the permissions necessary" });
    }
  },
];
