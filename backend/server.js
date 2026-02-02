import express from 'express';
import connectDB from './db/connectDB.js';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './models/users.models.js';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT||5000;

app.get("/api/users",async (req,res)=>{
    const users=await User.find();
    res.json(users);
});

app.post("/api/users/signup",async (req,res)=>{
    const user=new User(req.body);
    try{
        const savedUser=await user.save();
        res.status(201).json({message:"User registered successfully"});
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
    connectDB();
})