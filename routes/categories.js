const express = require("express");
const { CategoriesModel, validCategory } = require("../models/categoriesModel");
const { auth,authAdmin } = require("../middlewares/auth")
const router = express.Router();

router.get("/", auth , async(req,res) => {
  try{
    let data = await CategoriesModel.find({});
    res.status(200).json(data)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})

router.post("/", authAdmin, async (req, res) => {
  let validation = validCategory(req.body);
  if (validation.error) {
    return res.status(400).json(validation.error.details);
  }
  try {
    let category;
    if (req.body._id) {
      category = await CategoriesModel.findById(req.body._id);
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }
      category = await CategoriesModel.findByIdAndUpdate(req.body._id, req.body, { new: true });
    } else {
      category = new CategoriesModel(req.body);
      await category.save();
    }
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});



router.delete("/:categoryId", authAdmin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    let data = await CategoriesModel.deleteOne({ _id: categoryId });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});


module.exports = router;