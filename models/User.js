const mongoose = require("mongoose");
const Joi = require("joi");

const User = new mongoose.model("User", {
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
});

function validateUser(User) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(255),
    email: Joi.string()
      .required()
      .min(5)
      .max(255),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  };

  return Joi.validate(User, schema);
}

module.exports.validate = validateUser;
module.exports.User = User;
