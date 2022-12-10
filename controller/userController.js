const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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

    User.find({ email: req.body.email }, (err, user) => {
      if (err) {
        return next(err);
      }
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
