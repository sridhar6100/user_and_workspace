const User = require("../models/user.model");
const Workspace = require("../models/workspace.model");
const bcrypt = require('bcrypt');
const fs = require('fs');

const CreateUserController = async (req,res)=>{
    try
    {
        const {username,email,password} = req.body;
        const HashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            username,
            email,
            password:HashedPassword,
        });
        const newUser = await user.save();
        if(!newUser) return res.status(400).json({message:"failed to create user."});
        res.status(200).json("user created successfully.");
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const UpdateUserController = async (req,res)=>{
    try
    {
        const userId = req.params.id;
        const {username,email,password} = req.body;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"user not found."});
        if(username) user.username = username;
        if(email) user.email = email;
        if(password) user.password = await bcrypt.hash(password,10);
        const updatedUser = await user.save();
        if(!updatedUser) return res.status(400).json({message:"failed to create user."});
        res.status(200).json("user updated successfully.");
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteUserController = async (req,res)=>{
    try
    {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"user not found."});
        const workspaces = await Workspace.find({user:user._id});
        for (const workspace of workspaces) 
        {
            if(workspace.attachments.length > 0)
            {
                for(const file of workspace.attachments)
                {
                    fs.unlinkSync(`uploads/${file}`);
                }
            }
            if(workspace.icon != '')
            {
                fs.unlinkSync(`uploads/${workspace.icon}`);
            }
        }
        await Workspace.deleteMany({user:user._id});
        const deletedUser = await user.deleteOne();
        if(!deletedUser) return res.status(400).json({message:"failed to delete user."});
        res.status(200).json("user deleted successfully.");
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetUsersController = async (req,res)=>{
    try
    {
        const users = await User.find({},{ password: 0 });
        const userIds = users.map(user => user._id);
        const workspaceCountPromises = userIds.map(userId => {
            return Workspace.find({ user: userId });
        });
        const workspaceCounts = await Promise.all(workspaceCountPromises);
        const usersWithWorkspaceCounts = users.map((user, index) => {
            return {
                ...user._doc,
                workspaceCount: workspaceCounts[index].length
            };
        });
        res.status(200).json(usersWithWorkspaceCounts);
    }
    catch(error)
    {
        res.status(500).json(error);
    }
};

const GetUserController = async (req,res)=>{
    try
    {
        const userId = req.params.id;
        const user = await User.findById(userId,{ password: 0 });
        if(!user) return res.status(404).json({message:"user not found."});
        res.status(200).json(user);
    }
    catch(error)
    {
        res.status(500).json(error);
    }
};

module.exports = {
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    GetUsersController,
    GetUserController,
}