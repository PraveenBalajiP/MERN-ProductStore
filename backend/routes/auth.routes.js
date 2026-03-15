import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users.models.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authUser from '../middleware/authUser.js';

dotenv.config();

const routes=express.Router();

function generateTokenAndCookie(id,res){
    const token=jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"});
    res.cookie("login_token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:24*60*60*1000
    });
}

routes.post("/signup",async (req,res)=>{
    const {name,contact,password,address}=req.body;

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const userData={
        name,
        contact,
        password:hashedPassword,
        address
    };

    const savedData=new User(userData);
    console.log(savedData);
    try{
        if(await User.findOne({contact:contact})){
            res.status(400).json({message:"User already exists with this contact"});
        }
        else{
            await savedData.save();
            res.status(201).json({message:"User registered successfully"});
            
        }
    }
    catch(error){
        res.status(500).json({message:"Error during registration",error:error.message});
    }
})

routes.get("/signup",async (req,res)=>{
    try{
        res.send(await User.find());
    }
    catch(error){
        res.json({message:"Error fetching users",error:error.message});
    }
})

routes.post("/login",async (req,res)=>{
    const {contact,password}=req.body;
    const user=await User.findOne({contact:contact});
    console.log(user);
    try{
        if(!user){
            res.status(400).json({message:"No User Found, Kindly Sign Up before Logging In"});
        }
        else{
            const passwordMatch=await bcrypt.compare(password,user.password);
            if(!passwordMatch){
                res.status(400).json({message:"Incorrect Password Entered"});
            }
            else{
                generateTokenAndCookie(user._id,res);
                res.status(200).json({message:"Login Successful"});
            }
        }
    }
    catch(error){
        res.status(500).json({message:"Error during login",error:error.message});
    }
})



export default routes;