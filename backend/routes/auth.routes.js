import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users.models.js';
import Product from '../models/products.models.js';
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
                console.log({...user,message:"Login Successful"});
                const userData={
                    name:user.name,
                    contact:user.contact,
                    message:"Login Successful"
                }
                res.status(200).json(userData);
            }
        }
    }
    catch(error){
        res.status(500).json({message:"Error during login",error:error.message});
    }
})

routes.get("/check-auth",authUser,(req,res)=>{
    res.status(200).json({message:"Authorized",status:"Authorized"});
})

routes.get("/:name",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findOne({name:userName});
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            res.status(200).json({name:user.name,contact:user.contact});
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching user",error:error.message});
    }
})

routes.post("/logout",authUser,(req,res)=>{
    res.clearCookie("login_token");
    res.status(200).json({message:"Logout Successful"});
})

routes.get("/:name/profile",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own profile"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            res.status(200).json({
                name:user.name,
                email:user.contact.includes("@")?user.contact:"",
                phone:user.contact.match(/^\d{10}$/)?user.contact:"",
                address:user.address
            });
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching user profile",error:error.message});
    }

})

routes.post("/:name/browse",(req,res)=>{
    try{
        const {name,description,price,category}=req.body;
        const newProduct=new Product({name,description,price,category});
        newProduct.save();
        res.status(201).json({message:"Product added successfully"});
    }
    catch(error){
        res.status(500).json({message:"Error adding product",error:error.message});
    }
})

export default routes;