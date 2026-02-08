import express from 'express';
import User from '../models/users.models.js';

const routes=express.Router();

routes.post("/signup",async (req,res)=>{
    const data=req.body;
    const savedData=new User(data);
    try{
        await savedData.save()
        res.json({message:"Signup successful. Please log in."});
    }
    catch(error){
        res.json({message:"Signup failed. Please try again."});
    }
})

export default routes;