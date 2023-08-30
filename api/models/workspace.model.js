const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
    },
    icon:{
        type:String,
        default:'',
    },
    attachments:[{
        type:String,
    }],
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active',
    },
},{
    timestamps:true,
});

module.exports = mongoose.model("Workspace",workspaceSchema);