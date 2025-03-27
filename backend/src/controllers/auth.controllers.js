import express from "express";
import { generateTokens } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup=async(req,res)=>{
    const {fullName,email,password}=req.body;
    try{

        if(!fullName ||! email ||!password)
        {
            return res.status(400).json({message:"All fields are required "});        }
        if(password.length<8){
            return res.status(400).json({message:"Password must be atleast 8 characters"});
        }
        const user=await User.findOne({email});

        if (user) return res.status(400).json({message:"Email Already Exists"});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        });

        if(newUser){
            generateTokens(newUser._id,res);
            await newUser.save();

            res.status(201).json({_id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        }else{
            console.log("error in signup control")
            res.status(500).json({message:"Internal Sever error"});
        }

    }catch(err){
        console.error("Signup Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });

    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {// ✅ Debugging

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        generateTokens(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,  // Prevents JavaScript access
            secure: true,    // Only send over HTTPS
            sameSite: "Strict", // Prevents CSRF attacks
        });

        return res.status(200).json({ message: "Logout Successful" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const user_id=req.user._id;

        if(!profilePic)
        {
            return res.status(400).json({message:"Profile pic is reuired"});   
        }
        const uploadProfile=await cloudinary.uploader.upload(profilePic);

        const updatedUser=await User.findByIdAndUpdate(user_id,{profilePic:uploadProfile.secure_url},{new:true});

        res.status(200).json(updatedUser)
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error up"});
    }

};
export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
};