const express = require("express");
const { VideosModel, validVideo } = require("../models/videosModel");
const { UserModel} = require("../models/usersModel");
const { auth,authAdmin } = require("../middlewares/auth")
const router = express.Router();
const jwt = require('jsonwebtoken');
const { config } = require('../config/secret.js');

router.get("/", auth , async(req,res) => {
  try{
    const token = req.headers['x-api-key'];
    if (!token) {
      return res.status(401).json({ msg: "Missing token" });
    }

    jwt.verify(token, config.tokenSecret, async (err, user) => {
      if (err) {
        console.log('Verify error:', err);
        return res.status(401).json({ msg: "Invalid token"});
      }
      const userData = await UserModel.findById({ _id: user._id });
      const { family, gender, rank, role } = userData;
    
      let query;
      if (role) {
        query = {};
      } else {
        query = { family, gender };
        if (!rank) {
          query.rank = false;
        }
      }
    
      let data = await VideosModel.find(query).sort({ familyStatus: 1, gender: 1 }).populate('categories');
      res.status(200).json(data);
    });
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})

router.get("/:videoId", auth , async(req,res) => {
    try{
        const { videoId } = req.params;

      let data = await VideosModel.findOne({_id: videoId}).populate('categories');
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
    await video.save();
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

  setInterval(async () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    await VideosModel.updateMany({ dateCreated: { $lt: twoWeeksAgo } }, { new: false });

}, 2 * 30 * 24 * 60 * 60 * 1000);

module.exports = router;