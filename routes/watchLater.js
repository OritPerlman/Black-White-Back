const express = require("express");
const { WatchLaterModel } = require("../models/watchLaterModel");
const { auth,authAdmin } = require("../middlewares/auth")
const router = express.Router();

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
        let data = await WatchLaterModel.findOne({userId: user._id});
       res.status(200).json(data) })
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }  
  })

router.delete("/:videoId", auth, async (req, res) => {
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
      let data = await WatchLaterModel.deleteOne({ userId: user._id }, {videoId: req.params.videoId});
      res.status(200).json(data) })
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});
  
  router.put("/", auth, async (req, res) => {
    try {
      const token = req.headers['x-api-key'];
      if (!token) {
        return res.status(401).json({ msg: "Missing token" });
      }
  
      jwt.verify(token, config.tokenSecret, async (err, user) => {
        if (err) {
          console.log('Verify error:', err);
          return res.status(401).json({ msg: "Invalid token"});
        }       
        const updatedData = req.body;
        const updated = await WatchLaterModel.findOneAndUpdate(
          { userId: user._id },
          updatedData,
          { new: true, runValidators: true }
        );
        if (!updated) {
          return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(updated);      
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error updating user", err });
    }
  });
  
module.exports = router;