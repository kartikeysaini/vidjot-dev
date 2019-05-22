const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { User, validate } = require("../models/User");

//load helper

//Get Login
router.get("/login", (req, res) => {
  res.render("users/login");
});

//Get Registration
router.get("/register", (req, res) => {
  res.render("users/register");
});

//Post Registration
router.post("/register", async (req, res, next) => {
  let errors = [];

  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
  } else {
    let newUser = await User.findOne({ email: req.body.email });
    if (newUser) {
      req.flash("error_msg", "User Already Exist");
      res.redirect("/users/register");
    } else {
      newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      const SALT_WORK_FACTOR = 10;
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) console.log(err);
        // hash the password using our new salt
        bcrypt.hash(newUser.password, salt, async function(err, hash) {
          if (err) return console.log(err);
          newUser.password = hash;
          await newUser.save();
        });
      });
      req.flash("success_msg", "new User Registered");
      res.redirect("/users/login");
    }
  }

  // console.log(req.body);
  //res.send("register");
});

//Post Login
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//get logout

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "you are logged out");
  res.redirect("/users/login");
});
module.exports = router;
