const express = require("express");
const { WatchLaterModel } = require("../models/watchLaterModel");
const { auth,authAdmin } = require("../middlewares/auth")
const router = express.Router();

router.get("/", auth , async(req,res) => {
    try{
        const { userId } = req.tokenData._id;

      let data = await WatchLaterModel.findOne({userId: userId});
      res.status(200).json(data)
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }  
  })

router.delete("/", auth, async (req, res) => {
  try {
    const { userId } = req.tokenData._id;
    let data = await WatchLaterModel.deleteOne({ userId: userId });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.delete("/:videoId", auth, async (req, res) => {
    try {
        const { userId } = req.tokenData._id;
      const { videoId } = req.params;
      let data = await WatchLaterModel.deleteOne({ userId: userId }, {videoId: videoId});
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  });
  
  router.put("/", auth, async (req, res) => {
    try {
      const { userId } = req.tokenData._id;
      const updatedData = req.body;
      const updated = await WatchLaterModel.findOneAndUpdate(
        { userId: userId },
        updatedData,
        { new: true, runValidators: true }
      );
  
      if (!updated) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      res.status(200).json(updated);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error updating user", err });
    }
  });
module.exports = router;