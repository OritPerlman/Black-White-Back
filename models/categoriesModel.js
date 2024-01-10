const mongoose = require("mongoose");
const Joi = require("joi");

let categorySchema = new mongoose.Schema({
    name: String,
})
const CategoriesModel = mongoose.model('Categories', categorySchema);

validCategory = (_reqBody) => {
    let joiSchema = Joi.object({
        _id: Joi.string().optional(),
        name: Joi.string().min(2).max(99).required()
    })
    return joiSchema.validate(_reqBody)
}

module.exports = {
    CategoriesModel: mongoose.model("categories", categorySchema),
    validCategory: validCategory
  };