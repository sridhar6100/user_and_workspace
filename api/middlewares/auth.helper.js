const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");

const AuthUser = async (req,res,next) =>{
    try
    {
        const token = req.cookies.token;
        
        if(!token) return res.status(401).json({message:"user token missing."});

        const verified = jwt.verify(token,process.env.JWT_SECRET);

        if(!verified) return res.status(401).json({message:"invalid token."});

        const userId = jwt.decode(token)._id;

        const user = await User.findById(userId,{password:0});
        const admin = await Admin.findById(userId,{password:0});

        if(!user && !admin) return res.status(401).json({message:"invalid user auth."});

        req.isAdmin = admin ? admin.isAdmin : user.isAdmin;
        req.userId = admin ? admin._id : user._id;

        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = AuthUser;