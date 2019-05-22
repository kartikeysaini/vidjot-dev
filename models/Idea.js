const mongoose = require("mongoose");
const Joi = require("joi");

const Idea = mongoose.model("Idea", {
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  }
});

function validateIdea(Idea) {
  const schema = {
    title: Joi.string().required(),
    details: Joi.string().required()
  };

  return Joi.validate(Idea, schema);
}

module.exports.validate = validateIdea;
module.exports.Idea = Idea;
