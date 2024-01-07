const mongoose = require("mongoose");
const Joi = require("joi");
const Categories = require('./categoriesModel');

let videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    videoURL: String,
    date_created: {
        type: Date, default: Date.now()
    },
    familyStatus: {
        type: Boolean, default: false
    },
    gender: {
        type: Boolean, default: true
    },
    active: {
        type: Boolean, default: true
    },
    rank: {
        type: Boolean, default: false
    },
    watchLater: {
        type: Boolean, default: false
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
      }]

})
exports.VideosModel = mongoose.model("videos", videoSchema)

exports.validVideo = (_reqBody) => {
    let joiSchema = Joi.object({
        title: Joi.string().min(2).max(99).required(),
        description: Joi.string().min(2).max(99).required(),
        videoURL: Joi.string().min(2).max(99).pattern(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/).required(),
        })
    return joiSchema.validate(_reqBody)
}
