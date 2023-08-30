const Workspace = require("../models/workspace.model");
const jwt = require("jsonwebtoken");
const fs = require('fs');

const CreateWorkspaceController = async(req,res)=>{
    try
    {
        const {title,desc,userId} = req.body;
        const attachments = [];
        let icon = '';
        if(!userId) {
            deleteFiles(req.files);
            return res.status(404).json({message:'userId required.'})
        };
        if(req.files)
        {
            if(req.files['icon'])
            {
                icon = req.files['icon'][0].filename??'';
            }
            if(req.files['attachments'])
            {
                for(const file of req.files['attachments'])
                {
                    if(file.fieldname === 'attachments')
                    {
                        attachments.push(file.filename);
                    }
                }
            }
        }
        const workspace = new Workspace({
            user:userId,
            title,
            desc,
            icon,
            attachments,
        });
        const newWorkspace = await workspace.save();
        res.status(200).json(newWorkspace);
    }
    catch(error)
    {
        deleteFiles(req.files);
        res.status(500).json(error.message);
    }
};

const UpdateWorkspaceController = async (req,res)=>{
    try
    {
        const workspaceId = req.params.id;
        const {title,desc,deleteables} = req.body;
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            deleteFiles(req.files);
            return res.status(404).json({message:"workspace not found."})
        };
        if(title) workspace.title = title;
        if(desc) workspace.desc = desc;
        if(req.files)
        {
            if(req.files['icon'])
            {
                const oldIcon = workspace.icon;
                workspace.icon = req.files['icon'][0].filename??'';
                if(oldIcon != '')
                {
                    fs.unlinkSync(`uploads/${oldIcon}`);
                }

            }
            if(req.files['attachments'])
            {
                
                for(const file of req.files['attachments'])
                {
                    if(file.fieldname === 'attachments')
                    {
                        workspace.attachments.push(file.filename);
                    }
                }
            }
        }
        if(deleteables)
        {
            if (Array.isArray(deleteables))
            {
                for(const file of deleteables)
                {
                    const index = workspace.attachments.indexOf(file);
                    fs.unlinkSync(`uploads/${file}`);
                    workspace.attachments.splice(index,1)
                }
            }
            else
            {
                const index = workspace.attachments.indexOf(deleteables);
                fs.unlinkSync(`uploads/${deleteables}`);
                workspace.attachments.splice(index,1)
            }
        }
        const updatedWorkspace = await workspace.save();
        res.status(200).json(updatedWorkspace);
    }
    catch(error)
    {
        deleteFiles(req.files);
        res.status(500).json(error.message);
    }
};

const DeleteWorkspaceController = async (req,res)=>{
    try
    {
        const {userId} = req.body;
        const workspaceId = req.params.id;
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) return res.status(404).json({message:"workspace not found."});
        if(workspace.user === userId) return res.status(401).json({message:"you don't have permission."});
        const deletedWorkspace = await workspace.deleteOne();
        if(deletedWorkspace.attachments.length > 0)
        {
            for(const file of deletedWorkspace.attachments)
            {
                fs.unlinkSync(`uploads/${file}`);
            }
        }
        if(deletedWorkspace.icon !== '')
        {
            fs.unlinkSync(`uploads/${deletedWorkspace.icon}`);
        }
        res.status(200).json("workspace deleted successfully.");
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetWorkspacesController = async (req,res)=>{
    try
    {
        const {userId} = req.query;
        let filter = {};
        if(userId)
        {
            filter = {user:userId};
        }
        const workspaces = await Workspace.find(filter)
        .populate({path:'user',select:"username"});
        res.status(200).json(workspaces);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetWorkspaceController = async (req,res)=>{
    try
    {
        const workspaceId = req.params.id;
        const workspace = await Workspace.findById(workspaceId)
        .populate({path:'user',select:"username"});
        if(!workspace) return res.status(404).json({message:"workspace not found."});
        res.status(200).json(workspace);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};


function deleteFiles(files){
    try
    {
        if(files.length > 0)
        {
            for(const file of files)
            {
                fs.unlinkSync(`uploads/${file.filename}`);
            }
        }
    }
    catch(error)
    {
        console.log(error);
    }
};

module.exports = {
    CreateWorkspaceController,
    UpdateWorkspaceController,
    DeleteWorkspaceController,
    GetWorkspacesController,
    GetWorkspaceController,
};