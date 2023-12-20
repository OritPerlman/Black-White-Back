const express = require("express");
const { VideosModel } = require("../models/videosModel");
const { auth,authAdmin } = require("../middlewares/auth")
const router = express.Router();

router.get("/", auth , async(req,res) => {
  try{
    let data = await VideosModel.find({});
    res.status(200).json(data)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})

router.get("/:videoId", auth , async(req,res) => {
    try{
        const { videoId } = req.params;

      let data = await VideosModel.findOne({_id: videoId});
      res.status(200).json(data)
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }  
  })

router.post("/", authAdmin, async (req, res) => {
  let validBody = validVideo(req.body)
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    let video = new VideosModel(req.body)
    res.status(200).json(video)
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "err", err })
  }
})


router.delete("/:videoId", authAdmin, async (req, res) => {
  try {
    const { videoId } = req.params;
    let data = await VideosModel.deleteOne({ _id: videoId });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.patch("/changeActive/:videoId", authAdmin, async (req, res) => {
    try {
      const { videoId } = req.params;
      const { active } = req.body; 
      const updatedVideo = await VideosModel.findOneAndUpdate(
        { _id: videoId },
        { $set: { active: active } },
        { new: true, runValidators: true }
      );
  
      if (!updatedVideo) {
        return res.status(404).json({ msg: "Video not found" });
      }
  
      res.status(200).json(updatedVideo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error updating video", err });
    }
  });
  
  router.patch("/changeRank/:videoId", authAdmin, async (req, res) => {
    try {
      const { videoId } = req.params;
      const { rank } = req.body; 
      const updatedVideo = await VideosModel.findOneAndUpdate(
        { _id: videoId },
        { $set: { rank: rank } },
        { new: true, runValidators: true }
      );
  
      if (!updatedVideo) {
        return res.status(404).json({ msg: "Video not found" });
      }
  
      res.status(200).json(updatedVideo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error updating video", err });
    }
  });

module.exports = router;