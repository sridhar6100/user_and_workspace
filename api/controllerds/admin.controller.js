const jwt = require("jsonwebtoken");
const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');


const CreateAdminUserController = async (req,res,next) =>{
    try
    {
        const {username,password} = req.body;
        const HashedPassword = await bcrypt.hash(password,10);
        const admin = new Admin({
            username,
            password:HashedPassword,
        });
        const newAdmin = await admin.save();
        res.status(200).json(newAdmin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const UpdateAdminUserController = async (req,res,next) =>{
    try
    {
        const {username,password} = req.body;
        const HashedPassword = await bcrypt.hash(password,10);
        const admin = await Admin.findById(req.params.id);
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        if(username) admin.username = username;
        if(HashedPassword) admin.password = HashedPassword;
        const newAdmin = await admin.save();
        res.status(200).json(newAdmin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const DeleteAdminUserController = async (req,res,next) =>{
    try
    {
        const admin = await Admin.findById(req.params.id);
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        await admin.deleteOne();
        res.status(200).json("admin user deleted successfully.");
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetAdminUsersController = async (req,res,next) =>{
    try
    {
        const users = await Admin.find({},{ password: 0 });
        res.status(200).json(users);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetAdminUserController = async (req,res,next) =>{
    try
    {
        const admin = await Admin.findById(req.params.id,{ password: 0 });
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        res.status(200).json(admin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetAdminUserProfileController = async (req,res,next) =>{
    try
    {
        const {token} = req.body;
        const _id = await verifyToken(token,process.env.JWT_SECRET)._id;
        const admin = await Admin.findById(_id,{ password: 0 });
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        res.status(200).json(admin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    CreateAdminUserController,
    UpdateAdminUserController,
    DeleteAdminUserController,
    GetAdminUsersController,
    GetAdminUserController,
    GetAdminUserProfileController
};