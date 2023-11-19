const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config}= require("../config/secret")


let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    date_created: {
        type: Date, default: Date.now()
    },
    date_expired: {
        type: Date, default: (Date.now()+30)
    },
    role: {
        type: Boolean, default: false
    },
    active: {
        type: Boolean, default: true
    },
    rank: {
        type: String, default: "free"
    },
    family: {
        type: Boolean, default: false
    },
    gender: String,

})
exports.UserModel = mongoose.model("users", userSchema)

exports.createToken = (_id, role) => {
    let token = jwt.sign({ _id, role }, config.tokenSecret, { expiresIn: "60mins" })
    return token;
}

exports.validUser = (_reqBody) => {
    let joiSchema = Joi.object({
        firstName: Joi.string().min(2).max(99).required(),
        lastName: Joi.string().min(2).max(99).required(),
        email: Joi.string().email().required().unique().messages({
            'any.unique': 'Email must be unique',
          }),
        password: Joi.string().min(3).max(99).required(),
        gender: Joi.string().min(3).max(9).required()
    })
    return joiSchema.validate(_reqBody)
}

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody)
}
