const express = require("express");
const mongoose = require("mongoose");
const { Idea, validate } = require("../models/Idea");
// const sessionLimit = require('../middleware/session');

const { ensureAuthentication } = require("../helpers/auth");

const router = express.Router();

router.get("/add", ensureAuthentication, (req, res) => {
  res.render("ideas/add");
});

router.post("/", ensureAuthentication, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let ideas = new Idea({
    title: req.body.title,
    details: req.body.details,
    user: req.user.id
  });

  ideas = await ideas.save();
  req.flash("success_msg", "Video Idea Saved");
  res.redirect("/ideas");
});
router.put("/:id", async (req, res) => {
  const newIdea = await Idea.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, details: req.body.details },
    {
      new: true
    }
  );
  req.flash("success_msg", "Video idea Updated");
  await res.redirect("/ideas");
});

router.delete("/:id", async (req, res) => {
  const deleteIdea = await Idea.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Video Idea Removed");
  await res.redirect("/ideas");
});

router.get("/", ensureAuthentication, async (req, res) => {
  const ideas = await Idea.find({
    user: req.user.id
  }).sort({ date: -1 });

  res.render("ideas/viewIdeas", {
    ideas
  });
});

router.get("/edit/:id", async (req, res) => {
  let idea = await Idea.findOne({
    _id: req.params.id
  });

  await res.render("ideas/edit", {
    idea
  });
});

module.exports = router;
