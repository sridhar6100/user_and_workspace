const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const Admin = require("../models/admin.model");

const UserLoginController = async (req,res)=>{
    try 
    {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ field: "username", error: "Invalid username" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ field: "password", error: "Invalid password" });
      }
        const token = jwt.sign({ userId: user._id,isAdmin:false }, process.env.JWT_SECRET);
        const expirationTime = 60 * 60 * 1000; // One minute in milliseconds
        res.status(200).json({ message:"login success.",token:token});
    } 
    catch (error) 
    {
      return res.status(500).json({ error: "An error occurred during login" });
    }
};


const UserProfileController = async (req,res)=>{
  try
  {
    const userId = req.params.id;
    const user = await User.findById(userId,{password:0});
    if(!user) return res.status(404).json({message:"user profile not found."});
    res.status(200).json(user);
  }
  catch(error)
  {
    return res.status(500).json(error.message);
  }
}



// === admin auth ==== //
const AdminLoginController = async (req,res)=>{
  try 
  {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });

    if (!user) {
      return res.status(401).json({ field: "username", error: "Invalid username" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ field: "password", error: "Invalid password" });
    }
      const token = jwt.sign({ userId: user._id,isAdmin:true }, process.env.JWT_SECRET);
      const expirationTime = 60 * 60 * 1000; // One minute in milliseconds
      res.status(200).json({ message:"login success.",token:token});
  } 
  catch (error) 
  {
    return res.status(500).json({ error: "An error occurred during login" });
  }
};


const AdminProfileController = async (req,res)=>{
try
{
  const userId = req.params.id;
  const user = await Admin.findById(userId,{password:0});
  if(!user) return res.status(404).json({message:"user profile not found."});
  res.status(200).json(user);
}
catch(error)
{
  return res.status(500).json(error.message);
}
}

module.exports = {
    UserLoginController,
    UserProfileController,
    AdminLoginController,
    AdminProfileController,
}