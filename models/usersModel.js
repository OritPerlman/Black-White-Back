const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true }, // Adding unique constraint
  password: String,
  date_created: {
    type: Date,
    default: Date.now(),
  },
  date_expired: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
  },
  role: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  rank: {
    type: String,
    default: "free",
  },
  family: {
    type: Boolean,
    default: false,
  },
  gender: String,
});

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (_id, role) => {
  let token = jwt.sign({ _id, role }, config.tokenSecret, { expiresIn: "60m" });
  return token;
};

exports.validUser = (_reqBody) => {
  let joiSchema = Joi.object({
    firstName: Joi.string().min(2).max(99).required(),
    lastName: Joi.string().min(2).max(99).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(99).required(),
    gender: Joi.string().min(3).max(9).required(),
    family: Joi.boolean().required(), // Validate 'family' as a boolean
  });
  return joiSchema.validate(_reqBody);
};

exports.validLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(99).required(),
  });
  return joiSchema.validate(_reqBody);
};
