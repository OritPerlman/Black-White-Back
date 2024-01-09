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
    family: {
        type: Boolean, default: false
    },
    gender: {
        type: String
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
    new: {
        type: Boolean, default: true
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
        family: Joi.boolean(),
        gender: Joi.string(),
        active: Joi.boolean(),
        rank: Joi.boolean(),
        watchLater: Joi.boolean(),
        new: Joi.boolean(),
        categories: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // Assuming categories are ObjectIds
    });
    return joiSchema.validate(_reqBody);
}
