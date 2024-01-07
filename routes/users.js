const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validUser, validLogin, createToken } = require("../models/usersModel");
const { auth,authAdmin } = require("../middlewares/auth")
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "users work !" })
})

// A rout that checks that the token is correct and returns information 
//about it like id and his role
router.get("/checkToken", auth, async (req, res) => {
  res.status(200).json(req.tokenData);
})

router.get("/myInfo", auth, async (req, res) => {
  try {
    let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    res.status(200).json(userInfo)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})


router.get("/usersList", authAdmin , async(req,res) => {
  try{
    let data = await UserModel.find({},{password:0});
    res.status(200).json(data)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})

router.get("/userInfo/:userId", authAdmin , async(req,res) => {
  try{
    const { userId } = req.params;
    let data = await UserModel.findOne({ _id: userId });
    res.status(200).json(data)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})

router.post("/", async (req, res) => {
  let validBody = await validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "*****";
    res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({ msg: "Email already in the system, try logging in", code: 11000 });
    } else {
      console.log(err);
      return res.status(500).json({ msg: "Error", err });
    }
  }
});


router.post("/login", async (req, res) => {
  let validBody = validLogin(req.body)
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email, active: true })
    if (!user) {
      return res.status(401).json({ msg: "Password or email is worng ,code:1" })
    }
    let authPassword = await bcrypt.compare(req.body.password, user.password)
    if (!authPassword) {
      return res.status(401).json({ msg: "Password or email is worng ,code:2" })
    }
    let token = await createToken(user._id, user.role)
    res.status(200).json({ token, user })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "err", err })
  }
})

router.delete("/:userId", authAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    let data = await UserModel.deleteOne({ _id: userId });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const userId = req.tokenData._id;
    const updatedUserData = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      updatedUserData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error updating user", err });
  }
});

router.patch("/changeRole/:userId", authAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { role: role } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error updating user", err });
  }
});

router.patch("/changeActive/:userId", authAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { active } = req.body; 
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { active: active } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error updating user", err });
  }
});

router.patch("/changePassword", auth, async (req, res) => {
  try {
    const userId = req.tokenData._id;
    const { password } = req.body; 
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { password: password } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error updating password", err });
  }
});

router.get("/search", authAdmin, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const query = {};
    if (firstName) {
      query.firstName = new RegExp(firstName, 'i'); 
    }
    if (lastName) {
      query.lastName = new RegExp(lastName, 'i'); 
    }

    const users = await UserModel.find(query);

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error searching users", err });
  }
});


module.exports = router;