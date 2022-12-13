const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("dotenv").config();

exports.signup_get = (req, res, next) => {
  res.render("signup", { title: "Register" });
};

exports.signup_post = [
  body("first_name")
    .isLength({ min: 1 })
    .withMessage("First name must be at least 1 character long!")
    .trim()
    .escape(),
  body("last_name")
    .isLength({ min: 1 })
    .withMessage("Last name must not be empty!")
    .trim()
    .escape(),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Your email should look like this example@example.com"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/\d/)
    .withMessage("Password must contain a number"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("signup", {
        title: "Register User",
        errors: errors.array(),
      });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return next(err);
      }

      console.log(user);

      if (user) {
        return res.render("signup", {
          title: "Register User",
          emailError: "There already exists an user with that email.",
        });
      }

      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        User.create(
          {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
          },
          (err) => {
            if (err) {
              return next(err);
            }

            res.redirect("/");
          }
        );
      });
    });
  },
];

exports.login_get = (req, res, next) => {
  res.render("login", { title: "Login" });
};

exports.login_post = [
  passport.authenticate("local", {
    failureRedirect: "/log-in",
  }),
  function (req, res) {
    if (!req.query.redirect) {
      res.redirect("/");
    }

    res.redirect(`/${req.query.redirect}`);
  },
];

exports.signout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
};

exports.join_the_club_get = (req, res, next) => {
  if (req.user) {
    return res.render("join_club", { title: "Join the club" });
  }

  res.redirect("/log-in?redirect=join_club");
};

exports.join_the_club_post = [
  body("secret_code").trim().escape(),

  (req, res, next) => {
    if (req.body.secret_code == process.env.MEMBERSHIP_SECRET_CODE) {
      User.findByIdAndUpdate(
        { _id: req.user._id },
        { status: "Member" },
        (err) => {
          if (err) {
            return next(err);
          }

          res.redirect("/");
        }
      );
    } else {
      res.render("join_club", {
        title: "Join the club",
        error: "The secret code is wrong!",
      });
    }
  },
];

exports.admin_get = (req, res, next) => {
  if (req.user) {
    res.render("become_admin", { title: "Become admin" });
  }

  res.redirect("/log-in?redirect=become_admin");
};

exports.admin_post = [
  body("admin_code").trim().escape(),

  (req, res, next) => {
    if (req.body.admin_code == process.env.ADMIN_SECRET_CODE) {
      User.findByIdAndUpdate({ _id: req.user._id }, { admin: true }, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect("/");
      });
    } else {
      res.render("become_admin", {
        title: "Become admin",
        error: "The secret code is wrong!",
      });
    }
  },
];
