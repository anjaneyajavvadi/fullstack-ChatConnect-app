import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";
export const getUsersForSideBar=async(req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    }catch(err){
        console.log("Error in UsersGetter:",err.message);
        res.status(500).json({error:"Internal server error"});
    }

};
export const getMessages=async(req,res)=>{
    try{
    const {id:userToChatId}=req.params;
    const myId=req.user._id;

    const messages=await Message.find({
        $or:[{senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
    })
    
    res.status(200).json(messages);
    }
    catch(err){
        console.log("Error in messageGetter:",err.message);
    res.status(200).json({message:"Internal Server Error"});
    }   

};
export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imgUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imgUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imgUrl,
        });

        await newMessage.save();
        //to do realtime functionality;
        const receiverSocketId=getReceiverSocketId(receiverId);
        console.log("Receiver Socket ID:", receiverSocketId); 
        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);
    }catch(err){
        console.log("Error in messageSender:",err.message);
        res.status(500).json({message:"Internal Server Error"});
    }

};

