const mongoose = require("mongoose");
const Joi = require("joi");

let categorySchema = new mongoose.Schema({
    name: String,
})
exports.CategoriesModel = mongoose.model("categories", categorySchema)

exports.validCategory = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required()
    })
    return joiSchema.validate(_reqBody)
}
